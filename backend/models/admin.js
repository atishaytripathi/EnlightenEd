const mongoose = require("mongoose")
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const { type } = require("os");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: "admin"
    }
}, {timestamps: true})

adminSchema.virtual("password")
    .set(function(password) {
        this._password = password
        this.salt = uuidv1()
        this.encry_password = this.securePassword(password)
    }) 
    .get(function() {
        return this._password
    })

adminSchema.methods = {
    authenticate: function(plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password
    },

    securePassword: function(plainpassword) {
         if(!plainpassword) return "";
         try {
            return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
         }
         catch (err) {
            return ""
         }
    }
}

module.exports = mongoose.model("Admins", adminSchema)