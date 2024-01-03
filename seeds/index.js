import mongoose from "mongoose";
import Campground from "../models/campground.js";
import cities from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";



mongoose.connect("mongodb+srv://lybauber:colombia123@dbprueba.6vwlw9c.mongodb.net/yelp-camp"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})