// Importing required modules

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Seting up app object

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handle get request on root route

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Listening for HTTP request on specfic port
const port = 3000;
app.listen(port, (err) => {
  if (!err) {
    console.log(`Sever started on port ${port}`);
  }
});
