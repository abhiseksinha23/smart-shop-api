const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    products: [{
        productRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        count: Number
    }],
    cart: [{
        productRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        count: Number
    }, ],
});

module.exports = {
    userSchema: userSchema,
}