const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    res.redirect("/campgrounds");
                }else{
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground.id);
                }
            });
        }
    });
});

router.get("/:comments_id/edit", function (req, res){
    foundCampground = {
        id: req.params.id
    }
    Comment.findById(req.params.comments_id, function(err, foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {comment: foundComment, campground: foundCampground});
        }
    });
    
});

router.put("/:comments_id", checkCommentOwership, function(req, res){
    Comment.findOneAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComments){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comments_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comments_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

function checkCommentOwership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comments_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if (foundComment.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect("back");
    }
};

module.exports = router;