const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    profilePicUrl: String,
    password: String,
    products: [{
        productRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        count: { type: Number, default: 0 }
    }],
    cart: [{
        productRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        count: { type: Number, default: 0 }
    }, ],
});

module.exports = {
    userSchema: userSchema,
}