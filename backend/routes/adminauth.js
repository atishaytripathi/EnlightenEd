const express = require("express")
const { signup, signin } = require("../controllers/adminauth")
const { check } = require('express-validator')
const router = express.Router()
const jwt = require('jsonwebtoken');



function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

router.post('/signup', [
    check("name", "Name atleast should be 3 characters").isLength({min: 3}),
    check("email", "Email should be valid").isEmail(),
    check("password", "Password at least should be 6 characters").isLength({min: 6}),
] ,signup)

router.post('/signin', [
    check("email", "Email should be valid").isEmail(),
    check("password", "Password at least should be 6 characters").isLength({min: 6}),
] ,signin)

router.get('/', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    res.send('Admin Content');
});

module.exports = router