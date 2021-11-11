var User = require('../models/User');



module.exports = {
    // To check whether user is loginin or not 
    loggedInUser: (req, res, next) => {
        if(req.session && req.session.userId){
            next()
        } else if(req.session && req.session.passport){
            next();
        } else {
            res.redirect('/users/login');
        }
    },
    // second is used to pass the loggedin information to all the route and to all the template so it could be used there
    userInfo: (req, res, next) => {
        var userId = req.session && req.session.userId;
        if(userId) {
           User.findById(userId, "name, email photo age email country", (err, user) => {
               if(err) return next(err);
               req.user = user;
    //  If you put anythings in response to locals objects that will automatically be available in each and every template
               res.locals.user = user;
               next();
            }) 
        } else {
            req.user = null;
            res.locals.user = null;
            next();
        }
    }
}