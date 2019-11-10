require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const { Pool, Client } = require("pg");
const connectionString = "postgressql://postgres:horLARmiDE44(+++)@localhost:5432/teamwork";

const client = new Client({
  connectionString:connectionString,
});


client.connect()


const userController = require("./controllers/users");
// express setup
const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(express.json());

// route requirement setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// controller setup
userController(app, bcrypt, jwt, cloudinary, client);

//  server listener
const PORT = process.env.PORT || 3000;

app.listen(PORT, err => {
  if (err) {
    console.log("Server Error : " + err);
  } else {
    console.log("Server listening on port " + PORT);
  }
});
