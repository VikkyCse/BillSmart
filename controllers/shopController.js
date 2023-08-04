const Shop = require('../models/shop');

// Create a new shop
const createShop = async (req, res) => {
  try {
    const { name, image } = req.body;
    const shop = await Shop.create({ name, image });
    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the shop' });
  }
};

// Read all shops
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.findAll();
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching shops' });
  }
};

// Read a specific shop by ID
const getShopById = async (req, res) => {
  try {
    const shopId = req.params.id;
    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching shop by ID' });
  }
};

// Update a shop by ID
const updateShop = async (req, res) => {
  try {
    const shopId = req.params.id;
    const { name, image } = req.body;
    const updatedShop = await Shop.update(
      { name, image },
      { where: { id: shopId } }
    );
    res.status(200).json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the shop' });
  }
};

// Delete a shop by ID
const deleteShop = async (req, res) => {
  try {
    const shopId = req.params.id;
    await Shop.destroy({ where: { id: shopId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the shop' });
  }
};

module.exports = {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
};
