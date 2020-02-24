const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userid: String,
    productRef: String,
    count: number
});

module.exports = {
    cartSchema: cartSchema,
}