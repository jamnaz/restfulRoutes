let bodyParser = require("body-parser");
let methodOveride = require("method-override");
let expressSanitizer = require("express-sanitizer");
let mongoose = require("mongoose");
let express = require('express');
let router = express.Router();

mongoose.connect("mongodb://localhost/restfulBlogApp");
router.use(bodyParser.urlencoded({extended: true}));
router.use(expressSanitizer());
router.use(methodOveride("_method"));

//making DB pattern
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//Modelling the Schema
let Blog = mongoose.model("Blog", blogSchema); 


// Blog.create({
//     title: "test blog",
//     image: "https://images.unsplash.com/photo-1454240114721-ee3f75fd9440?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Grey mountain terrain"
// });

//ROUTES DECLARATIONS

//Root Route
router.get("/", function(req, res){
    res.redirect("/blogs");
});

//Index Route
router.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//New Route
router.get("/blogs/new", function(req, res){
  res.render("new");
});



//Create Route
router.post("/blogs", function(req, res){
//   let title = req.body.title;
// let image = req.body.image;
// let body = req.body.body
// let newTitle = {title:title, image:image, body:body}

  Blog.create(req.body.blog, function(err, newBlog){
    console.log(req.body);
    if(err){
      res.render("new");
    }else{
      //then redirect to the index
      res.redirect("/blogs");
    }
  });
});

//SHOW-route
router.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("blogs");
    }else{
  res.render("show", {blog: foundBlog});
    }
  });
});

//EDIT-route
router.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
  res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE-route
router.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
//DELETE route

router.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  })
});

module.exports = router;
