const bcrypt = require('bcrypt');

// Generate the salt



const hashed = (pass) => {
    const saltRounds = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(pass, salt);
    console.log(hashedPassword);
    return hashedPassword.toString();
};

const checkpass = (userpassword, dbpassword) => {

    // Compare the provided password with the hashed password
    return bcrypt.compareSync(userpassword, dbpassword);




}

// module.exports = { checkpass, hashed }