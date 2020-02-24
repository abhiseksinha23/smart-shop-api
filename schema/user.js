const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    userid: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    profilePicUrl: String,
    products: [{
        productRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        count: { type: Number, default: 0 }
    }],
    cart: [{
        productRef: { type: String, required: true },
        count: { type: Number, default: 0 }
    }],
});

module.exports = {
    userSchema: userSchema,
}