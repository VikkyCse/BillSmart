const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');
const Item = require('../models/Item');
const sequelize = require('../models/database');



// Read a specific cart by user ID
const getCartByUserId = async (req, res) => {
  try {
    const user_id = req.params.id;

    // Find the cart associated with the user_id
    const cart = await Cart.findOne({ where: { user_id: user_id } });

    if (!cart) {
      // If cart doesn't exist, create a new cart and return it
      const newCart = await Cart.create({ user_id });
      res.status(200).json(newCart);
    } else {
      // If cart exists, fetch its associated items
      const cartItems = await CartItem.findAll({
        where: { Cart_id: cart.id },
        include: [Item],
      });
      res.status(200).json({
        cart: cart,
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

    const cart = await Cart.findOne({ where: { user_id: user_id } });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    await CartItem.destroy({ where: { Cart_id: cart.id } });
    await Cart.destroy({ where: { user_id: user_id } });

    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the cart' });
  }
};


// Create a cart item
const createCartItem = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Item_id, Count, user_id } = req.body;

    const [cart, created] = await Cart.findOrCreate({ where: { user_id: user_id } });
    const item = await Item.findByPk(Item_id);

    if (!item) {
      throw new Error('Invalid Item');
      return
    }
    // console.log(item.Count);
    if (item.quantity < Count) {
      throw new Error('Invalid Count');
      return
    }

   
    

    const Cart_id = cart.id;

    const cartItem = await CartItem.create({ Item_id, Count, user_id, Cart_id });
    await item.decrement({ 'quantity': Count });

    await t.commit();
    res.status(201).send(cartItem);
  } catch (err) {
    await t.rollback();
    res.status(500).send({ error: 'Error creating the cart item', err: err.message });
  }
};

//update
const updateCartItem = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const cartItemId = req.params.id;
    const { Count } = req.body;

    const cartItem = await CartItem.findByPk(cartItemId);
    
    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    const item = await Item.findByPk(cartItem.Item_id);

    if (!item) {
      res.status(404).json({ error: 'Associated item not found' });
      return;
    }

    const previousCount = cartItem.Count;
    const countChange = Count - previousCount;

    
    if (item.quantity < Math.abs(countChange) && countChange>0) {
      res.status(400).json({ error: 'Requested count exceeds available quantity' });
      return;
    }

    await CartItem.update(
      { Count },
      { where: { id: cartItemId } }
    );

    if (countChange > 0) {
      await item.increment({ 'quantity': countChange }, { transaction: t });
    } else if (countChange < 0) {
      await item.decrement({ 'quantity': Math.abs(countChange) }, { transaction: t });
    }

    await t.commit();

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: 'Error updating the cart item' });
  }
};


// Delete a cart item by ID
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.item_id; // Access item_id from the URL
    const deletedRows = await CartItem.destroy({ where: { id: cartItemId } });

    if (deletedRows === 0) {
      // If no rows were deleted, the item might not exist or the ID is incorrect
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
