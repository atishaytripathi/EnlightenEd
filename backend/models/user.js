const mongoose = require("mongoose")
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
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
        default: "user"
    },
    bio: { type: String },
    socialMedia: {
        linkedin: { type: String },
        github: { type: String },
        website: { type: String },
        // other social media links
    },
    profilePhoto: { type: String }, // URL or file path
    courseProgress: [{type: Schema.Types.ObjectId, ref:'Progress'}]
}, {timestamps: true});

userSchema.virtual("password")
    .set(function(password) {
        this._password = password
        this.salt = uuidv1()
        this.encry_password = this.securePassword(password)
    }) 
    .get(function() {
        return this._password
    })

userSchema.methods = {
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

module.exports = mongoose.model("Users", userSchema)