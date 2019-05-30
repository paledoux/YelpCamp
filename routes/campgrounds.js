const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    var newCampground = {name : name, price: price, image : image, description : description, author : author}
    Campground.create(newCampground, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.redirect("campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampgrounds){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds");
        }
        
    });
});

module.exports = router;