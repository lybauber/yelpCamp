import Campground from "../models/campground.js";
import { v2 as cloudinary } from 'cloudinary';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import dotenv from 'dotenv';
dotenv.config();
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});


export const index = async (req, res) => {
    const campgrounds =  await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

export const renderNewForm =  (req, res) => {
    res.render('campgrounds/new')
}

export const createCampground =  async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

export const showCampground = async (req, res) => {
    const {id} = req.params;
    const campground =  await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path:'author'
        }
    }).populate('author');
    
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/show', {campground})
}

export const renderEditForm =  async (req, res) => {
    const {id} = req.params;
    const campground =  await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

export const updateCampground = async (req, res) => {
    const {id} = req.params;
    console.log(req.body)
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
       await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

export const deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect("/campgrounds");
}