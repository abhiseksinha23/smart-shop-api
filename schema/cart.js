const mongoose = require('mongoose');

const cartschema = new mongoose.Schema({
    userid: String,
    productRef: String,
    count: number
});

module.exports = {
    cartschema: cartschema,
}