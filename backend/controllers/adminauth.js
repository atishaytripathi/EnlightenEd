const Admin = require("../models/admin")
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
// var expressJwt = require('express-jwt')

const generateToken = (user) => {
    return jwt.sign(user, process.env.SECRET);
};

exports.signup = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
    console.log(req.body)
    const existingAdmin = await Admin.findOne({email: req.body.email});
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = new Admin(req.body)
    admin.save((err, admin) => {
        if(err) {
            return res.status(400).json({
                error: "Unable to add admin"
            })
        }
        const token = generateToken({ username: admin._doc.email, role: admin._doc.role });
        res.cookie('token', token, { httpOnly: true });
        return res.json({
            message: "Success",
            role:'admin',
            token,
            admin
        })
    })
}

exports.signin = (req, res) => {
    const {email, password} = req.body

    console.log(email, password)

    Admin.findOne({email}, (err, admin) => {
        if(err || !admin) {
            return res.status(400).json({
                error:"Email was not found"
            })
        }

        //Authenticate user
        if(!admin.authenticate(password)) {
            return res.status(400).json({
                error:"Email and password do not match"
            })
        }

        //create token
        // const token = jwt.sign({_id: admin._id}, process.env.SECRET)
        const token = generateToken({ username: admin._doc.email, role: admin._doc.role });
        console.log(token)
        res.cookie('token', token, { httpOnly: true });
        //PUT TOKEN INTO COOKIE
        // res.cookie('token', token, {expire: new Date() + 1})

        //send response to frontend
        const {_id, name, email, role} = admin
        return res.json({
            token,
            admin: {
                _id,
                name,
                email,
                role
            }
        })

    })
}