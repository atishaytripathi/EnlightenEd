const User = require("../models/user")
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')


const generateToken = (user) => {
    return jwt.sign(user, process.env.SECRET);
};


exports.signup = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
    console.log(req.body)
    const user = new User(req.body)
    const existingUser = await User.findOne({email: req.body.email});
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const savedUser = await user.save();

        const token = generateToken({ email: savedUser.email, role: savedUser.role });
        res.cookie('token', token, { httpOnly: true });

        return res.json({
            message: "Success",
            role: 'user',
            token,
            user: savedUser,
        });
    } catch (err) {
        return res.status(400).json({
            error: "Unable to add user"
        });
    }
};

exports.signin = (req, res) => {
    const {email, password} = req.body

    console.log(email, password)

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error:"Email was not found"
            })
        }

        //Authenticate user
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error:"Email and password do not match"
            })
        }

        //create token
        // const token = jwt.sign({_id: user._id}, process.env.SECRET)
        const token = generateToken({ username: user._doc.email, role: user._doc.role });
        //PUT TOKEN INTO COOKIE
        res.cookie('token', token, { httpOnly: true })

        //send response to frontend
        const {_id, name, email, role} = user
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role
            }
        })

    })
};

// Get User
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user._id);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};