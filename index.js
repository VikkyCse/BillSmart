const sequelize = require('./models/database');
const express = require('express');
const userRoutes = require('./router/userRoutes');
const itemRoutes = require('./router/itemRoutes');
const shopRoutes = require('./router/shopRoutes');
const orderRoutes = require('./router/orderRoutes');
const cartRoutes = require('./router/cartRoutes');
const cartItemRoutes = require('./router/cartItemRoutes');
const couponRoutes = require('./router/couponRoutes');
const naturalsRoutes = require('./router/naturalsRoutes');

app = express();

app.use(express.json());

// Routes for each model
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/shops', shopRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);
app.use('/cartitems', cartItemRoutes);
app.use('/coupons', couponRoutes);
app.use('/naturals', naturalsRoutes);


const PORT = 8000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await sequelize.sync({ alter : true }); // alter - force
  console.log("Database synced");
});
