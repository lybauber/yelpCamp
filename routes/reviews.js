import {Router} from 'express';
import Review from '../models/review.js';
import Campground from '../models/campground.js';
import {reviewSchema} from '../schema.js';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';




const router = Router({mergeParams:true});

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(', ')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }    
}


router.post("/", validateReview, catchAsync(async(req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete("/:reviewId", catchAsync(async(req, res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`);

}))

export {router as reviewsRouter};