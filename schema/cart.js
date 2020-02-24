const mongoose = require('mongoose');

const cartschema = new mongoose.Schema({
    count: number,
    order: {
        id: {

        }
    }
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        userid: String
    }
});

module.exports = mongoose.model("Comment", commentschema);