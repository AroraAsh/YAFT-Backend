'use strict'

var Models = require('../../app/models')

exports.insert = async function(req, res, next){
  var activity = {
    name: req.body.name,
    activityType: req.body.activityType,
    startDateTime: req.body.startDateTime,
    endDateTime: req.body.endDateTime,
    userID: req.user._id,
    stepCount: req.body.stepCount,
    duration: req.body.duration,
    caloriesBurned: req.body.caloriesBurned,
    distance: req.body.distance
  }

  activity = await Models.Activity.insert(activity)
  .then(function(activity){
    return res.json({
      status: "success",
      message: "Activity inserted successfully",
      activityId: activity._id
    })
  })
  .catch(function(e){
    return res.json({
      status: "error",
      message: e.message
    })
  })
}

exports.update = async function(req, res, next){

}

exports.getByTime = async function(req, res, next){
  
}