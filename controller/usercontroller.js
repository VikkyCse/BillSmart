const User = require('../models/user')
const { checkpass, hashed } = require('../hashPassword')
const CreateUser = async (req, res) => {
    try {
        const { name,rfid, User_name, password , usertype,gender,isHosteller,rollNo } = req.body;

        // Find the user with the given name, or create a new user if it doesn't exist
        const [username, created] = await User.findOrCreate({
            where: { rfid },
            defaults: { name,rfid, User_name, password , usertype,gender,isHosteller,rollNo }
        });

        if (created) {
            // New user was created
            return res.status(200).json(user.toJSON());
        } else {
            // User with the same name already exists
            return res.status(200).json({ message: 'User already exists with the same name.' });
        }
    } catch (err) {
        return res.status(200).json({ message: err.message });
    }
}
const updateUser = async (req, res) => {
    const { name, email, id } = req.body
    // let password 
    if (req.body.password)
        password = hashed(req.body.password)


    const DbUser = await User.findOne({ where: { name: name } })

    try {
        const user = await User.update({ name: name || DbUser.name, email: email || DbUser.name, password: password || DbUser.password }, { where: { id: id || DbUser.id } })

        return res.json(user).status(200)
    } catch (err) {
        return res.status(200).json(err.message)
    }
}
const UserLogin = async (req, res) => {
    try {

        const { name, password } = req.query;

        const user = await User.findOne({ where: { name: name } })
        console.log(user.password);
        if (checkpass(password, user.password))
            res.end(JSON.stringify({ "message": true }));
        else
            res.end(JSON.stringify({ "message": false }));

    } catch (err) {
        res.status(200).send(JSON.stringify({ "message": "No user found" }));
    }
}
const rfidLogin = async (req, res) => {
    try {

        const { rfid, password } = req.query;

        const user = await User.findOne({ where: { rfid: rfid } })
        console.log(user.password);
        if (checkpass(password, user.password))
            res.end(JSON.stringify({ "message": true }));
        else
            res.end(JSON.stringify({ "message": false }));

    } catch (err) {
        res.status(200).send(JSON.stringify({ "message": "No user found" }));
    }
}

module.exports = {
    rfidLogin : rfidLogin,
    UserLogin: UserLogin,
    updateUser: updateUser,
    CreateUser: CreateUser
}