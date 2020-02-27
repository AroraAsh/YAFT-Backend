'use strict'

module.exports = function(app){
  var helloWorldController = require('./controllers/helloWorldController.js')
  var userController = require('./controllers/userController.js')
  var activityController = require('./controllers/activityController.js')
  var friendController = require('./controllers/friendController.js')
  var contestController = require('./controllers/contestController')

  function protectedURL(req, res, next){
    if(!req.user){
      res.json({
        status: "error",
        message: "You must be logged in to access this page."
      });
      res.end()
      return res;
    }

    next();
  }

  app.route('/hello/:name')
    .get(helloWorldController.hello);

  app.route('/hello_user')
    .get(helloWorldController.helloUser);

  app.route('/login')
    .post(userController.login)

  app.route('/logout')
    .get([protectedURL, userController.logout])

  app.route('/user/register')
    .post(userController.register)

  app.route('/user/profile')
    .get([protectedURL, userController.profile])

  app.route('/user/password')
    .post([protectedURL, userController.updatePassword])
  
  app.route('/user/update')
    .post([protectedURL, userController.updateUser])

  app.route('/user/add_weight')
    .post([protectedURL, userController.addWeight])

  app.route('/user/update_weight')
    .post([protectedURL, userController.updateWeight])

  app.route('/user/all')
    .get([protectedURL, userController.getAll])  

  app.route('/user/location')
    .post([protectedURL, userController.updateLocation])

  app.route('/activity/insert')
    .post([protectedURL, activityController.insert])

  app.route('/activity/update')
    .post([protectedURL, activityController.update])

  app.route('/activities/get_by_time')
    .get([protectedURL, activityController.getByTime])

  app.route('/activities/get_by_id')
    .get([protectedURL, activityController.getById])

  app.route('/friends/request')
    .post([protectedURL, friendController.friendRequest])

  app.route('/friends/confirm')
    .post([protectedURL, friendController.confirmRequest])

  app.route('/friends')
    .get([protectedURL, friendController.getFriends])

  app.route('/contest')
    .get([protectedURL,contestController.getContests])

  app.route('/contest')
    .post([protectedURL,contestController.makeContest])

  app.route('/contest/join')
    .post([protectedURL,contestController.joinContest])
}