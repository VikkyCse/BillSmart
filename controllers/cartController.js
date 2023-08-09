const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');
const Item = require('../models/Item');
const sequelize = require('sequelize');

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

// Delete a cart by ID
const deleteCart = async (req, res) => {
  try {
    const user_id = req.params.id;
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
    const cart = await Cart.findOne({ where: { user_id: user_id } });
    const item = await Item.findByPk(Item_id)
    if(item.Count < Count){
      res.send(json({ message:'Invalid Count'}))
      return
    }

    if(!cart){
      const Cart = await Cart.create({ user_id });
    }
    const cartItem = await CartItem.create({ Item_id, Count, user_id });
    item.count -= Count
    await item.save()

    await t.commit();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the cart item' });
    await t.rollback();
  }
};

// Update a cart item by ID
const updateCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { Item_id, Count } = req.body;
    const updatedCartItem = await CartItem.update(
      { Item_id, Count },
      { where: { id: cartItemId } }
    );
    res.status(200).json(updatedCartItem);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the cart item' });
  }
};

// Delete a cart item by ID
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await CartItem.destroy({ where: { id: cartItemId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the cart item' });
  }
};

module.exports = {
  getCartByUserId,
  deleteCart,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
