const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Hd8tDDdwnwgCXY0AOK1mmc8GyAWMtAImEx2Md8xA8upHS8K2RsRMl7W1tF7Af0uYdlytCe273N0SeHDRvyl6qHP00W5xXz31h");


// API

// -APP config
const app = express();

// -Middlewares
app.use(cors({origin: true}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})
app.use(express.json());

// - API routes
app.get("/", (request, response) => response.status(200).send("Hello world"));
app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log("payment request recieved", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// -Listen command
exports.api = functions.https.onRequest(app);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
