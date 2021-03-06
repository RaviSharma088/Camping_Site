var express =  require("express");
var router  =  express.Router();
var Campground = require("../models/campground");
const { route } = require("./comments");
var middleware    = require("../middleware");
//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Added successfully");
          res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
});

//CREATE - add new campground to DB
router.post("/campgrounds",middleware.isLoggedin, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author : author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/campgrounds/new",middleware.isLoggedin, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// edit campground page
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Edited campground successfully");
            res.render("campgrounds/edit",{campground: foundCampground});
        }
    });
});
//update campground page
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
// delete campground
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;