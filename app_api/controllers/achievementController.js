'use strict';

const AchievementTypes = require('../../app/models/achievementTypes');
var Models = require('../../app/models')

exports.list = async function(req, res){
  var achievementTypes = AchievementTypes.getAchievementTypes()
  if(req.user){
    var user = await Models.User.findOne({ email: req.user.email });
    user.achievements.forEach(function(achievement){
      if(achievementTypes[achievement.type]){
        achievementTypes[achievement.type].value = achievement.value
      }
    })
  }
  return res.json({
    status: "success",
    result: achievementTypes
  })
}