'use strict';

exports.hello = function(req, res){
  res.json({
    message: "Hello " + req.params.name
  })
}