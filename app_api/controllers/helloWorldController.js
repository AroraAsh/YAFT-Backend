'use strict';

exports.hello = function(req, res){
  res.json({
    message: "Hello " + req.params.name
  })
}

exports.helloUser = function(req, res){
  if(req.user){
    res.json({
      message: "Hello " + req.user.name
    })
  }else{
    res.json({
      result: "error",
      message: "You are not logged in"
    })
  }

}