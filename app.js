// Importing required modules

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const errorReporter = require("./errorReporting");

// Seting up app object

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database integration

const URL = "mongodb://localhost:27017/wikiDB";
mongoose.connect(URL);

// Article Schema

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

const myarticle = new Article({
  title: "How to win friends?",
  content:
    "How to win friends is a really popular book on human communication and relations.",
});

// myarticle.save();

// Handle get request on root route

app.get("/articles", (req, res) => {
  Article.find({}, (err, foundArticles) => {
    if (!err) {
      res.send(foundArticles);
    } else {
      console.log("Error occured while finding articles");
      errorReporter.reportError(err);
      res.send(err);
    }
  });
});

// Listening for HTTP request on specfic port
const port = 3000;
app.listen(port, (err) => {
  if (!err) {
    console.log(`Sever started on port ${port}`);
  } else {
    console.log("Reporting error while running app on  port ");
    errorReporter.reportError(err);
  }
});
