'use strict'

var Models = require('../../app/models')

exports.getContests = async function(req,res){
    await Models.Contest.get(req.user)
    .then(function(contests){
        return res.json({
            status: "success",
            message: "Contest retrieved successfully",
            contests
        })
    })
    .catch(function(e){
        return res.json({
            status: "error",
            message: e.message
          })
    })
}

exports.makeContest = async function (req,res){
    var participantOne = {
        userId: req.user._id,
        joinDate: Date.now
    }

    var contest = {
        name: req.body.name,
        description: req.body.description,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        creatorID: req.user._id,
        contestType: req.body.contestType,
        contestGoalType: req.body.contestGoalType,
        contestGoalValue: req.body.contestGoalValue,
        participant: [participantOne],
        locationStart: req.body.locationStart,
        locationEnd: req.body.locationEnd
    }
    
    contest = await Models.Contest.insert(contest)
    .then(function(contest){
        return res.json({
            status: "success",
            message: "Contest inserted successfully",
            contest
        })
    })
    .catch(function(e){
        return res.json({
            status: "error",
            message: e.message
          })
    })
}

exports.joinContest = async function (req,res){
    await Models.Contest.join(req.body.contestId,req.user)
    .then(function(contest){
        return res.json({
            status: "success",
            message: "Contest joined successfully",
            contest
        })
    })
    .catch(function(e){
        return res.json({
            status: "error",
            message: e.message
          })
    })

}