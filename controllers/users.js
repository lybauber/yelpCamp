
import user from '../models/user.js'

export const renderRegister = async (req, res) => {
    res.render('users/register');
}

export const userRegister = async (req, res, next) => {
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
}

export const renderLogin = (req, res) => {
    res.render('users/login');
}

export const userLogin =  (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    
}

export const userLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
    })
}