const express = require("express")
const router = express.Router()
const { subscribe } = require("../controllers/subscribe")
const { check } = require('express-validator')


router.post('/subscribe', [
    check("email", "Email should be valid").isEmail(),
] ,subscribe)


module.exports = router