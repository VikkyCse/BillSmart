const Shop = require('../models/shop');
const multer=require('multer')
const path=require('path');
const { urlToHttpOptions } = require('url');

// Create a new shop
const createShop = async (req, res) => {
  try {
    //  const { name} = req.body;
    // const {image}=req.file.path;
    let info={
      image:req.file.path,
      name:req.body.name
    } 

    const shop = await Shop.create( info );
    res.status(201).json(shop);
  
  } catch (err) {
    res.status(500).json({ error: 'Error creating the shop' , err});
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
// upload image 
const storage=multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null,'Images')  //file name should be unique so we are using Date.now(), 2/1/23.png

  },
  filename:(req,file,cb) => {
    cb(null,Date.now() + path.extname(file.originalname))
  }
})
const upload=multer({
  storage:storage,
  // limits:{fileSize:'1000000'},
  fileFilter:(req,file,cb) => {
    // const fileTypes = /jpeg | JPG | png | gif/
    const fileTypes = /jpeg|JPG|png|gif/i;
    const mimType=fileTypes.test(file.mimetype) //checking the file format
    const extname=fileTypes.test(path.extname(file.originalname))

    if(mimType && extname) {
      return cb(null,true)
    }
    cb('Give proper file format to upload')

  }
}).single('image')

module.exports = {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  upload
};
