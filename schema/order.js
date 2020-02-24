const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: String,
    productRef: String,
    count: Number
});

module.exports = {
    orderSchema: orderSchema,
}