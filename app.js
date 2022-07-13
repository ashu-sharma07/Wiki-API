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

// Handle get request on /articles route

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log("Error occured while finding articles");
        errorReporter.reportError(err);
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully fully added a new article");
      } else {
        errorReporter.reportError(err);
        res.send(err);
      }
    });
    console.log(newArticle);
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
        errorReporter.reportError(err);
      }
    });
  });

// Handle  request on Particular Article.

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle }, (err, foundArticle) => {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No Article with matching title found");
        }
      } else {
        res.send(err);
        errorReporter.reportError(err);
      }
    });
  })
  .put((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.updateOne(
      { title: articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        }
      }
    );
  })
  .patch(async (req, res) => {
    await Article.updateOne(
      {
        title: req.params.articleTitle, //conditions
      },
      {
        $set: req.body, //updates
      },
      (err) => {
        if (!err) {
          res.send("OK");
        } else {
          res.send(err);
        }
      }
    ).clone();
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted the correct article");
      } else {
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
