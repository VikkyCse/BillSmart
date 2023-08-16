const Category = require('../models/Category');
const Shop = require('../models/shop');
const multer=require('multer');
const path=require('path');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, Shopname } = req.body;
    const shop = await Shop.findOne({where:{name:Shopname}})
    if(!shop){
      res.send(JSON.stringify({"messsage":"shop not found"}))
      return
    }
    const category = await Category.create({ name,Shop_id:shop.id });
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
// upload image 
const storage=multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null,'Images')  //file name should be unique so we are using Date.now(), 2/1/23.png

  },
  filename:(req,file,cb) => {
    cb(null,Date.now() + path.extname(file.originalname))
  }
})
const Upload=multer({
  storage:storage,
  // limits:{fileSize:'1000000'},
  fileFilter:(req,file,cb) => {
    // const fileTypes = /jpeg | JPG | png | gif/
    const fileTypes = /JPEG|jpg|png|gif/i;
    const mimType=fileTypes.test(file.mimetype) //checking the file format
    const extname=fileTypes.test(path.extname(file.originalname))

    if(mimType && extname) {
      return cb(null,true)
    }
    cb('Give proper file format to upload')

  }
}).single('image')


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  Upload,
};
