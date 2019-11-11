'use strict'

module.exports = function(app){
  var helloWorldController = require('./controllers/helloWorldController.js')

  app.route('/hello/:name')
    .get(helloWorldController.hello);
}