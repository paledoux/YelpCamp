const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/* Campground.create({name: "Granite Hill", image: "https://www.photosforclass.com/download/flickr-1430198323", description: "This is a huge granit hill, no bathroom, no water, beutiful granit."}, function(err, campground){
    if(err){
        console.log(err);
    }else{
        console.log(campground);
    }
}) */

/* var campgrounds = [
        {name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104490f0c370a1ecb5b9_960.jpg&user=Pexels"},
        {name: "Granite Hill", image: "https://www.photosforclass.com/download/flickr-1430198323"},
        {name: "Mountain Goat's Rest", image: "https://www.photosforclass.com/download/flickr-3576042205"},
        {name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104490f0c370a1ecb5b9_960.jpg&user=Pexels"},
        {name: "Granite Hill", image: "https://www.photosforclass.com/download/flickr-1430198323"},
        {name: "Mountain Goat's Rest", image: "https://www.photosforclass.com/download/flickr-3576042205"}
    ] */
        

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name : name, image : image, description : description}
    Campground.create(newCampground, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.redirect("campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3000, function(){
    console.log("The Yelp Camp has started !");
});