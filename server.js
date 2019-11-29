var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars")

var db = require("./models");

var PORT = process.env.PORT || 4000;

var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/unit18homework";

mongoose.connect(MONGODB_URI);

app.get("/scrap", function(req, res) {
    axios.get("https://www.betootaadvocate.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        
        $(".td-module-thumb").each(function(i, element) {
            var result = {};
            result.title = $(this).children("a").attr("title");
            result.link = $(this).children("a").attr("href");
            result.img = $(this).children().children("img").attr("src");

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err)
            });

        });
        
        res.send("Scrape completed")
    });
});

app.get("/", function(req, res) {
    db.Article.find({}, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            var allArticles = {
                articles: results
            }
            res.render("index", allArticles);
        }
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne(
        {
            _id: req.params.id
        }
        ).populate("comment").then(function(results) {
            res.json(results)
        }).catch(function(err) {
            res.json(err)
        });
});

app.post("/submit/:id", function(req, res) {
    db.Comment.create(req.body).then(function(dbComment) {
        console.log(dbComment)
        return db.Article.findOneAndUpdate(
            {_id: req.params.id},
            { $push: {
                 comment: dbComment.id },
            },
            {new: true}
        ).then(function(dbArticle) {
            console.log(dbArticle)
            res.json(dbArticle)
        }).catch(function(err) {
            res.json(err)
        });
    });
});

app.put("/articles/:currentState/:id", function(req, res) {
    var favouriteState
    if (req.params.currentState == "true"){
        favouriteState = false
    }else{
        favouriteState = true
    }
    db.Article.update(
        { _id: req.params.id },
        { $set: {
            favourite: favouriteState
            }
        },
    function(err, results) {
        if (err) {
            console.log(err)
        }else {
            res.json(results)
        }
    }
    )
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT);
})