const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userid: String,
    productRef: String,
    count: Number
});

module.exports = {
    cartSchema: cartSchema,
}