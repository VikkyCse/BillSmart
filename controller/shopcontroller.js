const Shop = require('../models/shop');

// Function to create a new shop
const createShop = async (req, res) => {
    try {
        const { name, image } = req.body;

        // Create a new shop
        const shop = await Shop.create({ name, image });

        return res.status(200).json(shop.toJSON());
    } catch (err) {
        return res.status(200).json({ message: "An error occurred", error: err.message });
    }
};

// Function to get all shops
const getAllShops = async (req, res) => {
    try {
        // Find all shops
        const shops = await Shop.findAll();

        return res.status(200).json(shops.map((shop) => shop.toJSON()));
    } catch (err) {
        return res.status(200).json({ message: "An error occurred", error: err.message });
    }
};

// Function to update a shop
const updateShop = async (req, res) => {
    const { id, name, image } = req.body;

    try {
        // Find the shop by its id
        const shop = await Shop.findByPk(id);

        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        // Update the shop
        shop.name = name || shop.name;
        shop.image = image || shop.image;
        await shop.save();

        return res.status(200).json(shop.toJSON());
    } catch (err) {
        return res.status(200).json({ message: "An error occurred", error: err.message });
    }
};

// Function to delete a shop
const deleteShop = async (req, res) => {
    const { id } = req.body;
    try {
        // Find the shop by its id
        const shop = await Shop.findByPk(id);

        if (!shop) {
            return res.status(200).json({ message: "Shop not found"});
        }

        // Delete the shop
        await shop.destroy();

        return res.status(200).json({ message: "Shop deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

module.exports = {
    createShop,
    getAllShops,
    updateShop,
    deleteShop,
};
