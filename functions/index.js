const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./Permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const express = require("express");

const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51Hd8tDDdwnwgCXY0AOK1mmc8GyAWMtAImEx2Md8xA8upHS8K2RsRMl7W1tF7Af0uYdlytCe273N0SeHDRvyl6qHP00W5xXz31h"
);

const ProductsList = require("../src/utils/Products.json");

// API

// -APP config
const app = express();

// -Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// - API routes
app.get("/", async (request, response) => {
  return response.status(200).send("Hello");
});
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

//upload product images from rest api to firebase storage
// Step 1: Create the folder within ProductImages with ID
// Step 2: Go inside that folder and upload thumbnail image
//step 3: create folder for images inside the ID folder and upload product images in that
//step 4: When folder is complete move back and back create another folder with the given ID

// Products api

//Post/Create
app.post("/create", (req, res) => {
  (async () => {
    try {
      const collection = db.collection("Products");

      //to insert one new product use below code
      /*collection.doc('/' + req.body.id + '/').create({
          id: req.body.id,
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          image: req.body.image,
          rating: {
            rate: req.body.rating.rate,
            count: req.body.rating.count
          }
      });*/

      //used 3rd party api to create products in productly db / can use any other api too make sure to the structure is same
      /*const response = await axios.get(
        "https://dummyjson.com/products/?limit=100"
      );*/
      ProductsList.products.map((data) => {
        collection.doc("/" + data.id + "/").create({
          id: data.id,
          title: data.title,
          description: data.description,
          price: data.price,
          discountPercentage: data.discountPercentage,
          stock: data.stock,
          brand: data.brand,
          category: data.category,
          thumbnail: data.thumbnail,
          images: data.images,
          rating: data.rating,
        });
      });
      return res.status(200).send("Product Created");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Read/GET
app.get("/read", (req, res) => {
  (async () => {
    try {
      const response = await db
        .collection("Products")
        .get()
        .then((querySnapShot) => {
          return querySnapShot.docs.map((doc) => doc.data());
        });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.get("/readOnlyCategory", (req, res) => {
  (async () => {
    try {
      let category = [];
      await db
        .collection("Products")
        .orderBy("category")
        .get()
        .then((data) => {
          data.docs.map((doc) => {
            if (!category.includes(doc.data()["category"])) {
              category.push(doc.data()["category"]);
            }
          });
        });
      return res.status(200).send(category);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//filter by category get request
app.get("/filter/:category", (req, res) => {
  (async () => {
    try {
      const response = await db
        .collection("Products")
        .where("category", "==", req.params.category)
        .get()
        .then((queryResult) => {
          return queryResult.docs.map((doc) => doc.data());
        });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//UPDATE/PUT
app.put("/update/:id", (req, res) => {
  (async () => {
    try {
      await db.collection("Products").doc(req.params.id).update(req.body);
      //look below format
      /*{
        title: req.body?.title,
        description: req.body?.description,
        price: req.body?.price,
        image: req.body?.image,
        category: req.body?.category,
      }*/
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//REMOVe/DELETE
app.delete("/remove/:id", (req, res) => {
  (async () => {
    try {
      await db.collection("Products").doc(req.params.id).delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
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
