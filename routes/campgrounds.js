const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

router.get('/', catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res)=>{
    const campground = new Campground(req.body.campground);
    campground.author = req.user.id;
    await campground.save();
    req.flash('success', 'Successfully created campground');
    res.redirect(`/campgrounds/${campground._id}`); 
}));

router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req,res)=>{
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    req.flash('success', 'Campground edited successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground deleted successfully');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

module.exports = router;