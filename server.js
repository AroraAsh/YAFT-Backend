var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000.
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  passport = require('passport');

// Preparere the Database
mongoose.connect("mongodb://localhost:27017/fitness-db", {useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database connected succesfully.")
});

// Configure the server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

// Basic logging middleware
app.use(function(req, res, next){
  console.log(req.method + " " + req.url)
  next();
})

// Add Routs
var routes = require('./app_api/routes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Start the server
app.listen(port, () => {
  console.log("Server is listening on port " + port)
});

