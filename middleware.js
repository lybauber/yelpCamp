 export const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl; //save the url that user is trying to access 
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')  //redirect to login page if not authenticated
    }
    next();
}

//  export const storeReturnTo = (req, res, next) => {
//     if(req.session.returnTo){
//         req.locals.returnTo = req.session.returnTo;
//     }
//     next();
// }