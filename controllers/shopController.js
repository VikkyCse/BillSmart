const Shop = require('../models/shop');
const multer=require('multer')
const path=require('path');
const { urlToHttpOptions } = require('url');
const Item = require('../models/Item');
const Category = require('../models/Category');

// Create a new shop
const createShop = async (req, res) => {
  try {
    //  const { name} = req.body;
    // const {image}=req.file.path;
    let info={
      image:req.file.path,
      name:req.body.name,
      isSpecial: req.body.isSpecial || false,
      Hide:req.body.Hide || false
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
    res.status(500).json({ error: 'Error fetching shops' , err});
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
// const updateShop = async (req, res) => {
//   try {
//     const shopId = req.params.id;
//     // const { name, image } = req.body;
//     let info={
//       image:req.file.path,
//       name:req.body.name
//     } 
//     const updatedShop = await Shop.update(
//       { info },
//       { where: { id: shopId } }
//     );
//     res.status(200).json(updatedShop);
//   } catch (err) {
//     res.status(500).json({ error: 'Error updating the shop' });
//   }
// };


const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, Hide, isSpecial } = req.body;

    // Find the shop by ID
    const shop = await Shop.findByPk(id);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Update shop attributes
    shop.name = name || shop.name;
    shop.image = req.file.path || shop.image;
    shop.Hide = Hide || shop.Hide;
    shop.isSpecial = isSpecial || shop.isSpecial;

    // Save the updated shop
    await shop.save();

    res.status(200).json(shop);
    
  } catch (err) {
    res.status(500).json({ error: 'Error updating the shop' });
  }
};


// Delete a shop by ID
const deleteShop = async (req, res) => {
  try {
    const shopId = req.params.id;

    // Find the categories associated with the shop
    const categories = await Category.findAll({ where: { Shop_id: shopId } });

    // Collect the category IDs
    const categoryIds = categories.map(category => category.id);

    // Delete items associated with the found category IDs
    await Item.destroy({ where: { category_id: categoryIds } });

    // Delete categories associated with the shop
    await Category.destroy({ where: { Shop_id: shopId } });

    // Delete the shop
    await Shop.destroy({ where: { id: shopId } });

    // Respond with a 204 status code to indicate successful deletion
    res.status(204).end();
  } catch (err) {
    console.error(err);
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
