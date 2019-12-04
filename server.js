var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000.
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

mongoose.connect("mongodb://localhost:27017/fitness-db", {useNewUrlParser: true, useUnifiedTopology: true})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./app_api/routes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, () => {
  console.log("Server is listening on port " + port)
});
