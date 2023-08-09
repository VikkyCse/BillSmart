const Category = require('../models/Category');
const Item = require('../models/Item');

// Create a new item
const createItem = async (req, res) => {
  try {
    const { name, veg, image, price, categoryname ,quantity} = req.body;
    const category = await Category.findOne({where: { name:categoryname}})

  console.log(category)
    if(!category){
      res.status(200).json({error : 'category not found'})
      return
    }
    const item = await Item.create({ name, veg, image, price, category_id:category.id ,qty:quantity});
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the item' });
  }
};

// Read all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items' });
  }
};

// Read a specific item by ID
const getItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching item by ID' });
  }
};

// Update an item by ID
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, veg, image, price, category_id } = req.body;
    const updatedItem = await Item.update(
      { name, veg, image, price, category_id },
      { where: { id: itemId } }
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the item' });
  }
};

// Delete an item by ID
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.destroy({ where: { id: itemId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the item' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
