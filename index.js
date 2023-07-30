const sequlize = require('./models/database')

const express = require('express')
const {
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
} = require('./models/index');
app = express()
app.get('/', async (req, res) => {
    try {
        const newUser = await User.create({
            User_name: 'john_doe',
            rfid: 'rfid_value',
            name: 'John Doe',
            amount: 100.00,
            usertype: 1,
            gender: false,
            isHosteller: false,
            rollNo: 'ABC123',
            password: 'password123',
        });

        // The `newUser` variable will now hold the newly created user object
        console.log('New user created:', newUser.toJSON());
    } catch (error) {
        console.error('Error creating user:', error);
    }
})



app.listen(8000, async (req, res) => {
    console.log("server http://localhost:8000");
    await sequlize.sync({ alter: true });
    console.log("db sync")
})