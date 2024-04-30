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
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '65cd76b26dd3c6e0c80cdb98',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, quod.",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                 ]
            },
            images: [
                {
                url:'https://res.cloudinary.com/dff1gcvzu/image/upload/v1709165272/YelpCamp/poesrbz6pzr5muzycmg6.jpg',
                filename: 'YelpCamp/poesrbz6pzr5muzycmg6'
                },
                {
                url: 'https://res.cloudinary.com/dff1gcvzu/image/upload/v1709164197/YelpCamp/ueq981tmoixxegprlxnz.jpg',
                filename:'YelpCamp/ueq981tmoixxegprlxnz'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})