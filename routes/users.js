import express from 'express';
import {Router} from 'express';
import user from '../models/user.js';
import catchAsync from "../utils/catchAsync.js";
import passport from 'passport';
// import { storeReturnTo } from '../middleware.js';


const router = Router();

router.get('/register', async (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const {username, password, email} = req.body;
        const newUser = new user({username, email});
        const registeredUser = await user.register(newUser, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })

    } catch(e){
        console.log(e)
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
    })
})



export {router as userRouter};