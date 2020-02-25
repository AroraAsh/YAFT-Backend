'use strict'

var Models = require('../../app/models')

exports.friendRequest = async function(req,res,next){

    var requestFromEmailId= req.user.email
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

    var requestFromEmailId= req.user.email
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


exports.getFriends = async function(req,res,next){
    var email = req.user.email
    await Models.User.getFriends(email).then(function(friends){
      return res.json({
        status: "success",
        message: "Friend retreived successfully",
        friends
      })
    })
    .catch(function(e){
      return res.json({
        status: "error",
        message: e.message
      })
    })
}