'use strict';

const AchievementTypes = require('../../app/models/achievementTypes');
exports.list = async function(req, res){
  return res.json(AchievementTypes.getAchievementTypes())
}