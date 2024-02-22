import express from 'express';
import {Router} from 'express';
import user from '../models/user.js';
import catchAsync from "../utils/catchAsync.js";
import passport from 'passport';
import { storeReturnTo } from '../middleware.js';
import { renderRegister, userRegister, renderLogin, userLogin, userLogout } from '../controllers/users.js';


const router = Router();

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(userRegister))

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userLogin)

router.get('/logout', userLogout )



export {router as userRouter};