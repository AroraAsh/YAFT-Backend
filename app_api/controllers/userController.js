'use strict';

const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
var Models = require('../../app/models')

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  {usernameField: 'email'},
  function(username, password, done) {
      Models.User.login(username, password).then(function(user){
        if(!user){
          return done(null, false);
        }
  
        return done(null, user)
      })
  }
));

passport.use(new RememberMeStrategy(
  function(token, done) {
    Models.User.loginByToken(token)
    .then(function(user){
      return done(null, user)
    })
    .catch(function(e){
      return done(null, null)
    })
  },
  function(user, done) {
    Models.User.generateToken(user)
    .then(function(token){
      return done(null, token)
    })
    .catch(function(e){
      return done(null, null)
    })
  }
));

exports.login = function(req, res, next){
  passport.authenticate('local', function(err, user, info){

    if (err) { return next(err); }

    if(!user){
      res.json({
        status: "error",
        message: "Failed to log in"
      })
    }

    req.logIn(user, async function(err) {
      if (err) { return next(err); }
      if(req.body.remember_me){
        await Models.User.generateToken(user)
        .then(function(token){
          res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
        })
        .catch(function(e){ })
      }

      return res.json({
        status: "success",
        message: "You are now logged in as " + user.name,
        user: {
          name: req.user.name,
          email: req.user.email,
          age: req.user.age,
          gender: req.user.gender,
          awards: req.user.awards
        }
      })
    });

  })(req, res, next)
}

exports.logout = function(req, res){
  Models.User.deleteToken(req.user._id);
  req.logout();
  res.json({
    status: "success",
    message: "Logged out successfully"
  })
}

exports.register = async function(req, res){
  var user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender
  }

  user = await Models.User.register(user)
  .then(function(user){
    return res.json(
      {user: user}
    )
  })
  .catch(function(e){
    var errors = {};
    var message = "";
    if(e.name == "MongoError" && e.code == "11000" ){
      errors["email"] = "The email already exists in the database."
      message = "Email already exists"
    }

    if(e.errors){
      Object.keys(e.errors).forEach(function(key, index){
        errors[key] = e.errors[key].message
      })
      message = e.message
    }
    return res.json({
      status: "error",
      message: message,
      errors: errors
    })
  })

}

exports.updateUser = async function(req, res){
  var userUpdate = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender
  }

  await Models.User.update(req.user.email, userUpdate)
  .then(function(user){
    req.session.passport.user = user;
    res.json({
      status: "success",
      message: "Successfully updated your profile"
    })
  })
  .catch(function(e){
    var errors = {};

    if(e.errors){
      Object.keys(e.errors).forEach(function(key, index){
        errors[key] = e.errors[key].message
      })
    }
    return res.json({
      status: "error",
      message: e.message,
      errors: errors
    })
  })
}

exports.updatePassword = async function(req, res){
  await Models.User.updatePassword(req.user.email, req.body.oldPassword, req.body.newPassword)
  .then(function(ret){
    return res.json({
      status: "success",
      message: "Password changed."
    })
  })
  .catch(function(e){
    return res.json({
      status: "error",
      message: e.message
    })
  })
}

exports.profile = async function(req, res){
  if(!req.user){
    return res.json({
      status: "error",
      message: "You are not logged in"
    })
  }

  return res.json({
    status: "success",
    result:{
      name: req.user.name,
      email: req.user.email,
      age: req.user.age,
      gender: req.user.gender,
      awards: req.user.awards
    }
  })
}