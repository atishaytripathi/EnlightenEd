const express = require("express")
const router = express.Router()
const { signup, signin, getUser, updateUser, deleteUser } = require("../controllers/user")
const {check, validateResult} = require('express-validator')


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
],signin)

router.get('/', authenticateToken, (req, res) => {
    if (req.user.role !== 'user') return res.sendStatus(403);
    res.send('User Content');
});

router.get('/getUser/:email', getUser);
router.put('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', deleteUser);


module.exports = router