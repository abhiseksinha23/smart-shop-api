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

const { productSchema } = require('./schema/product');
const { userSchema } = require('./schema/user');

const product = mongoose.model("product", productSchema);
const user = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.send("IT'S WORKING!! BACKEND WITH FRONTEND");
});


app.get("/allProducts", (req, res) => {
    product.find({}, (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            res.status(200).json({ data: pr });
        }
    });
});


app.post("/addProduct", (req, res) => {
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


app.get("/types", (req, res) => {
    product.distinct("type", (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            res.status(200).json({ data: pr });
        }
    });
});


app.get("/category/:type", (req, res) => {

    let type = req.params.type.toLowerCase();
    product.distinct("category", { type: type }, (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            res.status(200).json({ data: pr });
        }
    });

});


app.get("/brands/:category/:type", (req, res) => {

    let type = req.params.type.toLowerCase();
    let category = req.params.category.toLowerCase();
    product.distinct("brand", { type: type, category: category }, (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            res.status(200).json({ data: pr });
        }
    });

});


app.get("products/:brand/:category/:type", (req, res) => {

    let type = req.params.type.toLowerCase();
    let category = req.params.category.toLowerCase();
    let brand = req.params.brand.toLowerCase();

    product.findAll({ type: type, category: category, brand: brand }, (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            res.status(200).json({ data: pr });
        }
    });

});


app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at ${3000}`);
});