const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, default: "user" },
    userid: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    profilePicUrl: { type: String, default: "https://image.flaticon.com/icons/svg/145/145848.svg" },
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
    }]
});

module.exports = {
    userSchema: userSchema,
}