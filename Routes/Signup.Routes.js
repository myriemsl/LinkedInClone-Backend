const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const gravatar = require('gravatar');
const { body, validationResult } = require ('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Signup (Route: POST /signup) 
router.post("/",
[
    body('fname', "Firstname must contain only alphabtic").isAlpha(),
    body('lname', "Lastname must contain only alphabtic").isAlpha(),
    body('username', "Lastname must contain only alphabtic").isAlpha(),
    body('email', "Please enter a valid Email").isEmail(),
    body('password', "Minimum length allowed is 5 characters").isLength({ min: 5 })
], (req, res) => {
     const errors= validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
     }
    const { fname, lname, username, email, password } = req.body;
  User.find({email: req.body.email})
      .then(users => {
          if(users.length) {
              return res
              .status(400)
              .send({ errors: [{msg: "User already exists!"}] });
          }
        const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        let newUser = new User({ fname, lname, username, avatar, email, password });
 bcrypt.genSalt(10, (err, salt) => { 
     if (err) {
         throw err;
     }
 bcrypt.hash(req.body.password, salt, (err2, hashedPwd) => {

    if (err2) {
        throw err2;
    }
 newUser.password = hashedPwd;
 newUser.save();

let payload = {
    userId: newUser._id,
} 

jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
    if (err) {
        throw err;
    }
    res.send({ token });
 });
});
});  
});
});

module.exports = router;
