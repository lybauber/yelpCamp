
import { Router } from "express";
import {index,renderNewForm,createCampground, showCampground, renderEditForm,updateCampground, deleteCampground} from "../controllers/campgrounds.js";
import ExpressError from "../utils/ExpressError.js";
import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";

const router = Router({mergeParams:true});


router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, validateCampground, catchAsync(createCampground))

router.get("/new", isLoggedIn, renderNewForm)


router.route("/:id")
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground))


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm))



export {router as campgroundsRouter};