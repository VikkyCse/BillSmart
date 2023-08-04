const sequelize = require('./models/database');
const express = require('express');
const userRoutes = require('./router/userrouter');
const itemRoutes = require('./router/itemrouter');
const shopRoutes = require('./router/shoprouter');
const orderRoutes = require('./router/orderrouter');
const cartRoutes = require('./router/cartrouter');
const cartItemRoutes = require('./router/cartitemrouter');
const couponRoutes = require('./router/couponrouter');
const naturalsRoutes = require('./router/naturalsrouter');

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
  await sequelize.sync({ alter:true }); //alter - force
  console.log("Database synced");
});
