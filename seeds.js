const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

var data = [
    {name:"Clouds rest", image: "https://images.unsplash.com/photo-1443890923422-7819ed4101c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80", description: "Big mountain"},
    {name:"Mont Brome", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80", description: "Montagne à Bromont"},
    {name:"Montagne Rose", image: "https://images.unsplash.com/photo-1542123690-24ded6bc5371?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80", description: "Grosse montagne rose et blanche"}
]

function seedDb() { 
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Removed campgrounds !");
            Comment.deleteMany({}, function(err){
                if(err){
                    console.log(err);
                }else{
                    //Add campgrounds
                    data.forEach(seed => {
                        Campground.create(seed, function(err, createdCampground){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("Campgrounds created !");
                                //Create comments
                                Comment.create({
                                    text: "This place is great, but I wish there was internet",
                                    author: "Homer"
                                }, function(err, comment){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        createdCampground.comments.push(comment);
                                        createdCampground.save();
                                        console.log("Created new comment");
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }  
    });
 };


 module.exports = seedDb;