const Category = require('../models/Category');
const Item = require('../models/Item');
const multer=require('multer')
const path=require('path')

// Create a new item
const createItem = async (req, res) => {
  try {
   
    // const { name, veg, image, price, categoryname ,quantity} = req.body;
    const category = await Category.findOne({where: { name:req.body.categoryname}})

  console.log(category)
    if(!category){
      res.status(200).json({error : 'category not found'})
      return
    }
    let info1={
      name:req.body.name,
      veg:req.body.veg,
      image:req.file.path,
      price:req.body.price,
      category_id: category.id,
      quantity:req.body.quantity
    }
    const item = await Item.create(info1);
    res.status(201).send(item);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the item',err});
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

// // Update an item by ID
// const updateItem = async (req, res) => {
//   try {
//     const itemId = req.params.id;
//     // const { name, veg, image, price, category_id } = req.body;
//     let info1={
//       name:req.body.name,
//       veg:req.body.veg,
//       image:req.file.path,
//       price:req.body.price,
//       category_id: category.id,
//       quantity:req.body.quantity
//     }
//     const updatedItem = await Item.update(
//       { info1 },
//       { where: { id: itemId } }
//     );
//     res.status(200).json(updatedItem);
//   } catch (err) {
//     res.status(500).json({ error: 'Error updating the item' });
//   }
// };
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, veg, price, quantity, categoryname } = req.body; // Extract categoryname
    const category = await Category.findOne({ where: { name: categoryname } }); // Use categoryname

    if (!category) {
      res.status(200).json({ error: 'Category not found' });
      return;
    }

    let updateData = {
      name,
      veg,
      price,
      category_id: category.id,
      quantity
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const [numUpdatedRows, updatedItems] = await Item.update(updateData, {
      where: { id: itemId },
      returning: true,
    });

    if (numUpdatedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItems[0]);
  } catch (err) {
    console.error('Error updating the item:', err);
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
// upload image 
const storage=multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null,'Images')  //file name should be unique so we are using Date.now(), 2/1/23.png

  },
  filename:(req,file,cb) => {
    cb(null,Date.now() + path.extname(file.originalname))
  }
})
const imgupload=multer({
  storage:storage,
  // limits:{fileSize:'1000000'},
  fileFilter:(req,file,cb) => {
    // const fileTypes = /jpeg | JPG | png | gif/
    const fileTypes = /JPEG|jpg|png|gif|JPG/i;
    const mimType=fileTypes.test(file.mimetype) //checking the file format
    const extname=fileTypes.test(path.extname(file.originalname))

    if(mimType && extname) {
      return cb(null,true)
    }
    cb('Give proper file format to upload')

  }
}).single('image')

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  imgupload
};
