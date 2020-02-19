const express = require("express");
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

mongoose.connect("mongodb+srv://smart-shop-admin:password1234@smart-shop-db-drot2.mongodb.net/smart-shop-db?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const productschema = new mongoose.Schema({
    name: String,
    brand: String,
    type: String,
    category: String,
    count: Number,
    price: Number,
    image: String,
    description: String
});

const product = mongoose.model("product", productschema);


const userschema = new mongoose.Schema({
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
const user = mongoose.model("user", userschema);

app.get("/", (req, res) => {
    res.send("IT'S WORKING!!");
});
app.get("/product", (req, res) => {
    product.find({}, (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            res.status(200).json({ data: pr });
        }
    });
});
app.get("/product/new", (req, res) => {
    res.render("new");
});
app.post("/product", (req, res) => {
    const body = (req.body);
    console.log(body);
    let name = body["name"];
    let price = body["price"];
    let brand = body["brand"];
    let type = body["type"];
    let category = body["category"];
    let image = body["imageUrl"];
    let count = body["count"];
    let description = body["description"];
    let pr = { name: name, price: price, brand: brand, type: type, category: category, count: count, image: image, description: description };
    product.create(pr, (err, newly) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            res.status(200).json({ data: newly });
        }
    })
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at ${3000}`);
});