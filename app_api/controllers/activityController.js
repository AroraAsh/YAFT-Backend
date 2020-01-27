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
  var start = Date.parse(req.query.start);
  var end = Date.parse(req.query.end);

  if(isNaN(start) || isNaN(end)){
    return res.json({
      status: "error",
      message: "Start or end date was formatted incorrectly"
    })
  }

  await Models.Activity.getByTime(start, end, req.user._id)
  .then(function(activities){
    return res.json({
      status: "success",
      activities: activities
    })
  })
  .catch(function(e){
    return res.json({
      status: "error",
      message: e.message
    })
  })
    
}