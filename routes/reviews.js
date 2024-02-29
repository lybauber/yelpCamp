import {Router} from 'express';
import { createReview, deleteReview } from '../controllers/reviews.js';
import catchAsync from '../utils/catchAsync.js';
import {validateReview, isLoggedIn, isReviewAuthor} from '../middleware.js';





const router = Router({mergeParams:true});


router.post("/", isLoggedIn, validateReview, catchAsync(createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

export {router as reviewsRouter};