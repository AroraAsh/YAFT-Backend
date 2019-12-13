'use strict'

module.exports = function(app){
  var helloWorldController = require('./controllers/helloWorldController.js')
  var userController = require('./controllers/userController.js')

  function protectedURL(req, res, next){
    if(!req.user){
      return res.json({
        message: "You must be logged in to access this page."
      })
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
    .get(userController.profile)

  app.route('/user/password')
    .post([protectedURL, userController.updatePassword])
  
  app.route('/user/update')
    .post([protectedURL, userController.updateUser])
}