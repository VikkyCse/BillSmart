
// Import all the models
const Shop = require('./shop');
const Category = require('./category');
const Item = require('./Item');
const User = require('./user');
const Transaction = require('./Transaction');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const Coupon = require('./coupon');
const Naturals = require('./naturals');
const Order = require('./order');
const OrderItem = require('./orderItem');
const TransactionType = require('./TranscationType');

// Define model associations (relationships)
Category.belongsTo(Shop, { foreignKey: 'shop_id', targetKey: 'id' });
Category.hasMany(Category, { foreignKey: 'parent_category_id', as: 'subCategories' });
Item.belongsTo(Category, { foreignKey: 'category_id', targetKey: 'id' });
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Transaction.belongsTo(TransactionType, { foreignKey: 'Type', targetKey: 'id' });
Transaction.belongsTo(Coupon, { foreignKey: 'coupon_id', targetKey: 'id' });
Transaction.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id' });
Cart.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
CartItem.belongsTo(Item, { foreignKey: 'Item_id', targetKey: 'id' });
CartItem.belongsTo(Cart, { foreignKey: 'Cart_id', targetKey: 'id' });
Coupon.belongsToMany(User, { through: 'UserCoupon', foreignKey: 'coupon_id' });
User.belongsToMany(Coupon, { through: 'UserCoupon', foreignKey: 'user_id' });
Naturals.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Order.belongsTo(Transaction, { foreignKey: 'transcation_id', targetKey: 'id' });
Order.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
OrderItem.belongsTo(Item, { foreignKey: 'product_id', targetKey: 'id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id' })

// Export the models
module.exports = {
    Shop,
    Category,
    Item,
    User,
    Transaction,
    Cart,
    CartItem,
    Coupon,
    Naturals,
    Order,
    OrderItem,
    //... other models
};
