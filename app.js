import express from "express";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import ExpressError from "./utils/ExpressError.js";
import methodOverride from "method-override";
import passport from "passport";
import LocalStrategy from "passport-local";
import user from "./models/user.js";

import { campgroundsRouter } from "./routes/campgrounds.js";
import { reviewsRouter } from "./routes/reviews.js";
import { userRouter } from "./routes/users.js";
import userModel from "./models/user.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect("mongodb+srv://lybauber:colombia123@dbprueba.6vwlw9c.mongodb.net/yelp-camp"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set("views", __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(user.authenticate()))

passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())





app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
    
})

app.use('/', userRouter)
app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:id/reviews', reviewsRouter)


app.get("/", (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log("serving in port 3000");
})