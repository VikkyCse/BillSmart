const sequelize = require('./models/database');
const express = require('express');
const bodyParser = require('body-parser')
const multer=require('multer');
const userRoutes = require('./router/userRoutes');
const itemRoutes = require('./router/itemRoutes');
const shopRoutes = require('./router/shopRoutes');
const orderRoutes = require('./router/orderRoutes');
const cartRoutes = require('./router/cartRoutes');
// const cartItemRoutes = require('./router/cartItemRoutes');
const couponRoutes = require('./router/couponRoutes');
const naturalsRoutes = require('./router/naturalsRoutes');
const categoryRoutes = require('./router/categoryRoutes')
// const orderItem = require('./models/orderItem')
app = express();

app.use(express.json());
app.use(bodyParser.text({ type: '/' }));
// Routes for each model
app.use('/users', userRoutes);
app.use('/item', itemRoutes);
app.use('/shops', shopRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/categories',categoryRoutes)
// app.use('/cartitems', cartItemRoutes);
app.use('/coupons', couponRoutes);
app.use('/naturals', naturalsRoutes);
// static images folder
app.use('/Images',express.static('./Images'))


const PORT = 8000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
//  await sequelize.sync({alter:true})/// alter - force
  console.log("Database synced");
});
