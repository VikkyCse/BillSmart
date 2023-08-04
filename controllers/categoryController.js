const Category = require('../models/Category');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the category' });
  }
};

// Read all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

// Read a specific category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching category by ID' });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    const updatedCategory = await Category.update(
      { name },
      { where: { id: categoryId } }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the category' });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    await Category.destroy({ where: { id: categoryId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the category' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
