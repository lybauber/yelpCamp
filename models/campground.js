import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CampgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
});

const Campground = mongoose.model('Campground', CampgroundSchema);

export default Campground;