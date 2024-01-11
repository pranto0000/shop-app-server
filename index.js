const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// middlewere
app.use(cors());
app.use(express.json());

// VcQ0hrPOPIzv9k6G
// elahiepranto

// mongoDb Configration
mongoose
  .connect(
    // `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@food-app.xpk1dvx.mongodb.net/food-app?retryWrites=true&w=majority`
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@softwebmissionecommerce.8rmkhpw.mongodb.net/softwebmissionecommerce?retryWrites=true&w=majority`
    )
  .then(
    console.log("MomgoDB Connect Successfully")
  )
  .catch((error) => console.log("Error Connect to MongoBD", error));

  // jwt authentication 
  app.post('/jwt',async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1hr',
    })
    res.send({token})
  })

  

  // import routes here 
  const menuRouters = require("./api/routes/menuRoutes.js")
  const cartRouters = require("./api/routes/cartRoutes.js")
  const userRoutes = require("./api/routes/userRoutes.js")
  const paymentRoutes = require('./api/routes/PaymentRoutes.js')
  const adminStats = require('./api/routes/adminStats.js')
  const orderStats = require('./api/routes/orderStats.js');
const verifyToken = require("./api/middleware/verifyToken.js");
  app.use('/menu',menuRouters)
  app.use('/carts',cartRouters)
  app.use('/users',userRoutes)
  app.use('/payments',paymentRoutes)
  app.use('/adminStats',adminStats)
  app.use('/orderStats',orderStats)


  // stripe payment routers 
  app.post("/create-payment-intent",verifyToken, async (req, res) => {
    const { price } = req.body;
    const amount =(price * 100) ;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
