'use strict'

var Models = require('../../app/models')

exports.friendRequest = async function(req,res,next){

    var requestFromEmailId= req.body.requestFromEmailId
    var requestToEmailId= req.body.requestToEmailId

    await Models.User.friendRequest(requestFromEmailId,requestToEmailId).then(function(activity){
        return res.json({
          status: "success",
          message: "Friend Requested successfully"
        })
      })
      .catch(function(e){
        return res.json({
          status: "error",
          message: e.message
        })
      })
}

exports.confirmRequest = async function(req,res,next){

    var requestFromEmailId= req.body.requestFromEmailId
    var requestToEmailId= req.body.requestToEmailId
    await Models.User.confirmRequest(requestFromEmailId,requestToEmailId).then(function(activity){
        return res.json({
          status: "success",
          message: "Friend Request confirmed successfully"
        })
      })
      .catch(function(e){
        return res.json({
          status: "error",
          message: e.message
        })
      })
    
}