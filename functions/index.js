const functions = require("firebase-functions");
const admin = require('firebase-admin');
var serviceAccount = require("./Permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const express = require("express");
const axios = require('axios');
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Hd8tDDdwnwgCXY0AOK1mmc8GyAWMtAImEx2Md8xA8upHS8K2RsRMl7W1tF7Af0uYdlytCe273N0SeHDRvyl6qHP00W5xXz31h");


// API

// -APP config
const app = express();

// -Middlewares
app.use(cors({origin: true}));
app.use(express.json());

// - API routes
app.get("/", async (request, response) => {
  response.status(200).send(data.data)});
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


// Products api

//Post/Create
app.post('/create', (req, res) => {
  (async () => {
    try{
      const collection = db.collection('Products');
      const response = await axios.get('https://fakestoreapi.com/products');
      response.data.map(data =>{
        collection.doc('/' + data.id + '/')
        .create({
          id: data.id,
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          image: data.image,
          rating: {
            rate: data.rating.rate,
            count: data.rating.count
          }
      })
      });
      return res.status(200).send();
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
  })();
})


//Read/GET
app.get('/read', (req, res) => {
  (async() => {
    try{
      const response = await db.collection('Products').doc();
      console.log(response);
      return res.status(200).send(response);
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
  })()
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
