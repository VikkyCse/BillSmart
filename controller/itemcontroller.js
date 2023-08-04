const Item = require('../models/items')


const createItem= async (req, res) => {
    try {
        const { name,veg,image,price } = req.body;

        // Find the item with the given name, or create a new item if it doesn't exist
        const [itemname, created] = await Item.findOrCreate({
            where: { name },
            defaults: { name,veg,image,price }
        });

        if (created) {
            // New item was created
            return res.status(200).json(itemname.toJSON());
        } else {
            // item with the same name already exists
            return res.status(200).json({ message: 'item already exists with the same name.' });
        }
    } catch (err) {
        return res.status(200).json({ "message": err.message });
    }
}
// const updateitem = async (req, res) => {
//     const {name,veg,image,price } = req.body
    
//     const Dbitem = await Item.findOne({ where: { name: name } })
//     if (!DBitem) {
//         return res.status(200).json({ message: "Item not found" });
//     }

//     try {
//         const item = await Item.update({ name: name || Dbitem.name,veg:veg || Dbitem.veg , image : image || Dbitem.image , price:price || Dbitem.price }, { where: { id: id || Dbitem.id } })

//         return res.json(item).status(200)
//     } catch (err) {
//         return res.status(200).json(err.message)
//     }
// }
const updateitem = async (req, res) => {
    const { name, veg, image, price } = req.body;

    try {
        // Check if the item exists in the database
        const DBitem = await Item.findOne({ where: { name: name } });

        if (!DBitem) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Update the item
        await Item.update(
            { veg: veg || DBitem.veg, image: image || DBitem.image, price: price || DBitem.price },
            { where: { id: DBitem.id } }
        );

        // Fetch the updated item from the database
        const updatedItem = await Item.findOne({ where: { name: name } });

        return res.status(200).json(updatedItem.toJSON());
    } catch (err) {
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};


const deleteitem = async (req, res) => {
    const { name } = req.body;
    try {
        
        const DBitem = await Item.findOne({ where: { name: name } });

        if (!DBitem) {
            return res.status(202).json({ message: "Item not found" });
        }

        
        await DBitem.destroy();

        return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        return res.status(200).json({ message: "An error occurred", error: error.message });
    }
};



module.exports = {
    createItem,
    updateitem,
    deleteitem
}