const sequlize = require('./models/database')
const userRoutes = require('./router/userrouter');
const express = require('express')

// Pass the hashed function as a parameter to the User model definition
const User = require('./models/user')
app = express()
app.use(express.json())
app.use('/user', userRoutes);





// app.get('/', async (req, res) => {
//     try {
//         const newUser = await User.create({
//             User_name: 'john_doe',
//             rfid: 'rfid_value',
//             name: 'John Doe',
//             amount: 100.00,
//             usertype: 1,
//             gender: false,
//             isHosteller: false,
//             rollNo: 'ABC123',
//             password: 'password123',
//         });
//         res.send(newUser.toJSON())

//         // The `newUser` variable will now hold the newly created user object
//         console.log('New user created:', newUser.toJSON());
//     } catch (error) {
//         console.error('Error creating user:', error);
//     }
// })
 


app.listen(8000, async (req, res) => {
    console.log("server http://localhost:8000");
    await sequlize.sync({ alter: true });
    console.log("db sync")
})