require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const app = express();
app.use(cors());
console.log(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to lekhoShop wesite.")
});

const array = [];
const calculateOrderAmount = (items) => {
  items.map((item) => {
                const {price, cartQuantity} = item
                const cartItemAmount = price * cartQuantity
                // console.log(cartItemAmount);
                return array.push(cartItemAmount)
                
            });
           // console.log(array)
           const totalAmount = array.reduce((a, b) => {
              return a + b
           }, 0) ;
                  //console.log(totalAmount);
                  

  return totalAmount * 100;
}; 


app.post("/create-payment-intent", async (req, res) => {
  const { items, shipping, description } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    description,
    shipping: {
      address: {
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        country: shipping.country,
        postal_code: shipping.postal_code,
      },
      name: shipping.name,
      phone: shipping.phone,
    },
    //receipt_email: customerEmail
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));