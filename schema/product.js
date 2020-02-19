const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    type: String,
    category: String,
    count: Number,
    price: Number,
    image: String,
    description: String
});

module.exports = {
    productSchema: productSchema
}