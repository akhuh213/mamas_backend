require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;
const db = require('../../models')




// GET api/users/test (Public)
router.get('/register', (req, res) => {
    res.json({ msg: 'User endpoint OK'});
});

// POST api/usrs/register (Public)
router.post('/register', (req,res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(user) {
            return res.status(400).json({msg: 'Email already exists'})
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if (error) throw error
                    newUser.password = hash
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(error => console.log(error))
                })
            })
        }
    })
})

// POST api/usrs/register (Public)
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find a user via email
    db.User.findOne({ email})
    .then(user => {
        if (!user) {
            res.status(400).json({ msg: 'User not found'})
        } else {
            // Check password with bcrypt
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    // User match, send JSON web toekn
                    // Create a token payload (you can include anything you want)
                    const payload = {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                    // Sign token
                    jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (error, token) => {
                        res.json({ success: true, token: `Bearer ${token}`})
                    })
                } else {
                    return res.status(400).json({ password: 'Password or email is incorrect'})
                }
            })
        }
    });
})

// GET api/users/current (Private)
router.get('/current', passport.authenticate('jwt', { session: false }), (req,res) => {
    res.json({
        id:req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})


module.exports = router; 
