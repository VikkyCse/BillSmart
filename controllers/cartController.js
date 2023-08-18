const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');
const Item = require('../models/Item');
const sequelize = require('../models/database');

// Error Messages
const ERR_CART_NOT_FOUND = 'Cart not found';
const ERR_ITEM_NOT_FOUND = 'Associated item not found';
const ERR_REQUESTED_COUNT_EXCEEDS_QUANTITY = 'Requested count exceeds available quantity';

const getCartByUserId = async (req, res) => {
  try {
    const user_id = req.params.id;
    const cart = await Cart.findOne({ where: { user_id } });

    if (!cart) {
      const newCart = await Cart.create({ user_id });
      res.status(200).json(newCart);
    } else {
      const cartItems = await CartItem.findAll({
        where: { Cart_id: cart.id },
        include: [Item],
      });
      res.status(200).json({
        cart,
        items: cartItems,
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart by ID' });
  }
};

const deleteCart = async (req, res) => {
  try {
    const user_id = req.params.id;

    const cart = await Cart.findOne({ where: { user_id } });

    if (!cart) {
      res.status(404).json({ error: ERR_CART_NOT_FOUND });
      return;
    }

    await CartItem.destroy({ where: { Cart_id: cart.id } });
    await Cart.destroy({ where: { user_id } });

    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the cart' });
  }
};

const createCartItem = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Item_id, Count, user_id } = req.body;

    const [cart, created] = await Cart.findOrCreate({ where: { user_id } });
    const item = await Item.findByPk(Item_id);

    if (!item) {
      throw new Error('Invalid Item');
    }

    if (item.quantity < Count) {
      throw new Error('Invalid Count');
    }

    const Cart_id = cart.id;

    const cartItem = await CartItem.create({ Item_id, Count, user_id, Cart_id });
    await Item.update(
      { quantity: item.quantity - Count },
      { where: { id: item.id } }
    );

    await t.commit();
    res.status(201).send(cartItem);
  } catch (err) {
    await t.rollback();
    res.status(500).send({ error: 'Error creating the cart item', err: err.message });
  }
};

const updateCartItem = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const cartItemId = req.params.id;
    const { Count } = req.body;

    const cartItem = await CartItem.findByPk(cartItemId);
    
    if (!cartItem) {
      res.status(404).json({ error: ERR_CART_ITEM_NOT_FOUND });
      return;
    }

    const item = await Item.findByPk(cartItem.Item_id);

    if (!item) {
      res.status(404).json({ error: ERR_ITEM_NOT_FOUND });
      return;
    }

    const previousCount = cartItem.Count;
    const countChange = Count - previousCount;

    if (item.quantity < Math.abs(countChange) && countChange > 0) {
      res.status(400).json({ error: ERR_REQUESTED_COUNT_EXCEEDS_QUANTITY });
      return;
    }

    await CartItem.update(
      { Count },
      { where: { id: cartItemId } }
    );

    await Item.update(
      { quantity: item.quantity - countChange },
      { where: { id: item.id } }
    );

    await t.commit();

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: 'Error updating the cart item' });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.item_id;
    const deletedRows = await CartItem.destroy({ where: { id: cartItemId } });

    if (deletedRows === 0) {
      res.status(404).send({ error: 'Cart item not found' });
    } else {
      res.status(204).end(); // 204 No Content - Successfully deleted
    }
  } catch (err) {
    res.status(500).send({ error: 'Error deleting the cart item', err });
  }
};

module.exports = {
  getCartByUserId,
  deleteCart,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
