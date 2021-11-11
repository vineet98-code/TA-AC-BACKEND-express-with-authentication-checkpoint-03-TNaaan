var passport = require('passport');
var User = require('../models/User')

// GitHubStrategy 

var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  }, (accessToken, refreshToken, profile, cb) => {
      console.log(profile)
      var profileData = {
        name : profile.displayName,
        username : profile.username,
        email : profile._json.email,
        photo : profile._json.avatar_url,
      }
    
      User.findOne({email : profile._json.email}, (err,user) => {
          if(err) return cb(err);
          // if user doesn't exist 
          if(!user){
              User.create(profileData, (err,adduser) => {
                  console.log('success')
                  if(err) return next(err);
                  return cb(null, adduser)
              })
          }
          cb(null, user)
       })
  }
));


// Google Strategy

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// console.log(process.env.GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    var profileData = {
        name : profile._json.name,
        email : profile._json.email,
        photo : profile._json.picture,
    }

    User.findOne({email: profile._json.email}, (err,user) => {
        if(err) return cb(err);
        if(!user){
            User.create(profileData, (err, addeduser)=> {
                if(err) return cb(err);
                return cb(null, addeduser)
            })
        }else{
            cb(null, user)
        }
    })
  }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });


passport.deserializeUser(function(id, done) {
  User.findById(id,"name email username photo", function(err, user) {
    done(err, user);
  });
});