const express = require("express");
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require("stripe")("sk_test_C2PTrKHpONvCrYTGFkBpAvB000Gc8oS54q");
const uuid = require("uuid/v4");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://smart-shop-admin:password1234@smart-shop-db-drot2.mongodb.net/smart-shop-db?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const { productSchema } = require('./schema/product');
const { userSchema } = require('./schema/user');
const product = mongoose.model("product", productSchema);
const user = mongoose.model("user", userSchema);

//////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
    res.send("IT'S WORKING!! BACKEND WITH FRONTEND");
});

////////////////////////////////////////////////////////////////
//PRODUCTS URL

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

app.get("/product/:id", (req, res) => {
    product.findById(req.params.id, (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            console.log(pr);
            res.status(200).json({ data: pr });
        }
    });
});

app.post("/addProduct", (req, res) => {
    const body = (req.body);
    // console.log(body);
    let name = body["name"].toLowerCase();
    let price = body["price"];
    let brand = body["brand"].toLowerCase();
    let type = body["type"].toLowerCase();
    let category = body["category"].toLowerCase();
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


app.get("/:type/category", (req, res) => {

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


app.get("/:type/:category/brands", (req, res) => {

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


app.get("/:type/:category/:brand/products", (req, res) => {

    let type = req.params.type.toLowerCase();
    let category = req.params.category.toLowerCase();
    let brand = req.params.brand.toLowerCase();

    product.find({ type: type, category: category, brand: brand }, (err, pr) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            res.status(200).json({ data: pr });
        }
    });

});

/////////////////////////////////////////////////////////////////////////////
//USER ROUTES

app.post("/user", (req, res) => {
    let userid = req.body.userId;
    user.find({ userid: userid }, (err, user) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err })
        } else {
            if (user.length === 0) {
                let message = "NO SUCH USER EXISTS";
                res.status(200).json({ exists: false });
            } else {
                res.status(200).json({ data: user, exists: true });
            }
            // console.log(user.length);
        }
    });
});

app.get("/user", (req, res) => {
    user.find({}, (err, user) => {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            // res.send("it worked");
            res.status(200).json({ data: user });
        }
    });
});
app.post("/createUser", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let userid = req.body.userId;
    let profilePicUrl = req.body.profilePicUrl;

    let ur = { name: name, email: email, userid: userid, profilePicUrl: profilePicUrl };
    user.find({ userid: userid }, (err, us) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            if (us.length === 0) {
                user.create(ur, (err, newly) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.status(200).json({ data: newly });
                        //res.redirect("")
                    }
                });
            } else {
                res.status(200).json({ data: us[0] });
            }
        }
    });
    // user.create(ur, (err, newly) => {
    //     if (err) {
    //         console.log(err);
    //         if (err.message === "E11000 duplicate key error collection: smart-shop-db.users index: userid_1 dup key: { userid: ${userid} }") {
    //             let message = {
    //                 "err": "userid already exists"
    //             };
    //             return res.status(500).json({ error: message });
    //         }
    //         let message = "USERID or EMAIL ALREADY EXISTS";
    //         res.status(500).json({ error: message, error2: err.message });
    //     } else {
    //         res.status(200).json({ data: newly });
    //         //res.redirect("")
    //     }
    // })
});

///////////////////////////////////////////////////////////
//CART ROUTES

app.post("/:userid/addtocart", (req, res) => {
    let userid = req.params.userid;
    //let productRef = req.body.productRef;
    // let count = req.body.count;
    // let cr = { productRef: productRef, count: count };
    user.findOne({ userid: userid }, (err, us) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            // us.cart.push(cr);
            us.cart = req.body.cartItems;
            // us.cart.splice(0, us.cart.length, ...req.body.cartItems);
            us.save((err, u) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(u);
                }
            });
            res.status(200).json({ data: us });
        }
    });
});

// app.get("/delete", (req, res) => {
//     user.deleteMany({}, (err) => {
//         if (err) {
//             res.status(500).json({ error: err });
//         } else {
//             // res.status(200).json({ data: "deleted" });
//             res.send("deleted");
//         }

//     })
// });
app.get("/:userid/cart", (req, res) => {
    let userid = req.params.userid;
    user.findOne({ userid: userid }, (err, us) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            let productsInCart = [];
            let cart = us.cart;

            if (cart.length === 0) {
                res.status(200).json({ data: [] });
            } else {
                cart.forEach(function(c, i) {

                    product.findById(c.productRef, (err, pr) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            productsInCart.push({
                                prod: pr,
                                cartCount: c.count,
                            });

                            if (productsInCart.length === cart.length) {
                                res.status(200).json({ data: productsInCart });
                            }
                        }
                    });
                });
            }
        }
    });
});
///////////////////////////////////////////////////////////////////////
//PRODUCT ROUTES

app.post("/:userid/order", (req, res) => {
    let userid = req.params.userid;
    let productRef = req.body.productRef;
    let count = req.body.count;
    let cr = { productRef: productRef, count: count };
    user.findOne({ userid: userid }, (err, us) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            us.products.push(cr);
            us.save((err, u) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    console.log(u);
                }
            });
            res.status(200).json({ data: us });
        }
    });
});



app.get("/:userid/orders", (req, res) => {
    let userid = req.params.userid;
    user.findOne({ userid: userid }, (err, us) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            let productsInOrder = [];
            let products = us.products;
            if (products.length === 0) {
                res.status(200).json({ data: [] });
            } else {
                products.forEach(function(p, i) {

                    product.findById(p.productRef, (err, pr) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            productsInOrder.push({
                                prod: pr,
                                orderCount: p.count,
                            });

                            if (productsInOrder.length === products.length) {
                                res.status(200).json({ data: productsInOrder });
                            }
                        }
                    });
                });
            }

        }
    });
});

////////////////////////////////////////////////////////////////////
//PAYMENT (STRIPE)
app.post("/:userid/payment", (req, res) => {
    const token = req.body.token;
    const products = req.body.products;
    //let product_name = "";
    let totalprice = req.body.totalPrice;
    // products.forEach((prod) => {
    //     product_name += prod.name + " ";
    //     // totalprice += (prod.cartQuantity * prod.price);
    // });
    // const totalprice = req.body.totalPrice;
    console.log("Product ", products_name);
    console.log("price ", totalprice);
    const idempontencykey = uuid();
    return stripe.customers.create({
            email: token.email,
            source: token.id
        }).then(customer => {
            stripe.charges.create({
                source: req.body.stripeTokenId,
                amount: totalprice,
                currency: 'inr',
                customer: customer.id,
                receipt_email: token.email,
                //description: `purchase of ${product_name}`,
                shipping: {
                    name: token.card.name,
                    address: {
                        country: token.card.address_country
                    }
                }
            }, { idempontencykey })
        })
        .then((result) => {
            // let userid = req.params.userid;
            // products.forEach((prod) => {
            //     let cr = { productRef: prod._id, count: prod.cartQuantity };
            //     user.findOne({ userid: userid }, (err, us) => {
            //         if (err) {
            //             console.log(err);
            //             res.status(500).json({ error: err });
            //         } else {
            //             us.products.push(cr);
            //             us.save((err, u) => {
            //                 if (err) {
            //                     res.status(500).json({ error: err });
            //                 } else {
            //                     console.log(u);
            //                 }
            //             });
            //             // res.status(200).json({ data: us });
            //         }
            //     });
            // });
            res.status(200).json(result);
        })
        .catch(err => console.log(err))
});

////////////////////////////////////////////////////////////////////
//ALL IN ONE

app.get("*", (req, res) => {
    res.send("WRONG ROUTE IS BEING CALLED");
});
/////////////////////////////////////////////////////////////////////
//CONNECTING ROUTES

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server started at ${port}`);
});