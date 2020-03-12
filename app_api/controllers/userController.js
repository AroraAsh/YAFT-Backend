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
      return res.json({
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
          height: req.user.height,
          stepGoal: req.user.stepGoal,
          distanceGoal: req.user.distanceGoal,
          calorieGoal: req.user.calorieGoal,
          activityGoal: req.user.activityGoal,
          sleepGoal: req.user.sleepGoal,
          weights: req.user.weights,
          awards: req.user.awards,
          friends: req.user.friendList
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
    email: req.body.email,
    gender: req.body.gender,
    height: req.body.height,
    stepGoal: req.body.stepGoal,
    distanceGoal: req.body.distanceGoal,
    calorieGoal: req.body.calorieGoal,
    activityGoal: req.body.activityGoal,
    sleepGoal: req.body.sleepGoal
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

exports.addWeight = async function(req, res){
  var weight = req.body.weight;
  var date = req.body.date;

  await Models.User.addWeight(req.user._id, weight, date)
  .then(function(user){
    Models.User.calculateWeightAchievements(req.user.email)
    req.session.passport.user = user;
    return res.json({
      status: "success",
      message: "Added weight successuflly.",
      weightId: user.weights[user.weights.length -1]._id
    })
  })
  .catch(function(e){
    return res.json({
      status: "error",
      message: e.message
    })
  })
}

exports.updateWeight = async function(req, res){
  var weightId = req.body.weightId;
  var weight = req.body.weight;
  var date = req.body.date;
  var deleteWeight = req.body.delete

  await Models.User.updateWeight(req.user._id, weightId, weight, date, deleteWeight)
  .then(function(user){
    req.session.passport.user = user;
    Models.User.calculateWeightAchievements(req.user.email)
    return res.json({
      status: "success",
      message: "Updated weight successuflly.",
      weightId: user.weights[user.weights.length -1]._id
    })
  })
  .catch(function(e){
    return res.json({
      status: "error",
      message: e.message
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
  var user = await Models.User.findOne({ email: req.user.email });
  if(!user){
    user = req.user
  }else{
    req.session.passport.user = user;
  }

  return res.json({
    status: "success",
    result:{
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      stepGoal: user.stepGoal,
      distanceGoal: user.distanceGoal,
      calorieGoal: user.calorieGoal,
      activityGoal: user.activityGoal,
      sleepGoal: user.sleepGoal,
      weights: user.weights,
      achievements: user.achievements,
      friends: user.friendList,
      location: user.location
    }
  })
}

exports.getAll = async function(req,res){
  var arr = [];
  req.user.friendList.forEach(function(entry){
    arr.push(entry.friendUserId.toString());
  })
  arr.push(req.user._id.toString());
  await Models.User.getAll(arr)
  .then(function(users){
    return res.json({
      status: "success",
      message: "Users retrieved.",
      users
    })
  })
  .catch(function(e){
    return res.json({
      status: "error",
      message: e.message
    })
  })
}

exports.updateLocation = async function(req,res){
  var email = req.user.email
  await Models.User.updateLocation(email,req.body.lat,req.body.long)
  .then(function(){
    return res.json({
      status: "success",
      message: "Location Updated."
    })
  })
  .catch(function(e){
    return res.json({
      status: "error",
      message: e.message
    })
  })
}