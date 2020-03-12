const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user.js');
const Activity = require('./activity.js');
const Contest = require('./contest.js')

exports.User = User;
exports.Activity = Activity;
exports.Contest = Contest;


const cron = require('node-cron');

cron.schedule("*/5 * * * *", async function() {
    console.log("Running Contest task every 5 minutes");

    var contests = await Contest.find({
        startDateTime: { $lte: Date.now()},
        isEnded: false
    });
    
    for(contest of contests) {
        console.log(contest);
        for(element of contest.participant){
            console.log(element);
            await Activity.aggregate([
                { $match: { userID: element.userID,
                    startDateTime:{$gte: contest.startDateTime},
                    endDateTime: { $lte: contest.endDateTime}}},
                {
                    $group:{
                        _id:null,
                        distance: { $sum: '$distance'},
                        stepCount: { $sum: '$stepCount'}
                    },
                }
            ]).then( function(res){
                res = res[0];
                if(res){
                    console.log(res);
                    if(contest.contestGoalType == 'DISTANCE')
                        element.value = res.distance;
                    else if(contest.contestGoalType == 'STEPS')
                        element.value = res.stepCount;
                }
            })
        };
        contest.participant.sort(compare);
        console.log('Assign ranks')
        let rank =1;
        for(user of contest.participant){
            if(contest.endDateTime<Date.now()&&rank==1){
                contest.winner = user.userID;
                contest.isEnded = true;
            }
            user.rank = rank;
            rank++;
        }
        
        await contest.save();
        
    }
  });

  function compare(a,b){
      var valueA = a.value;
      var valueB = b.value;

      let comparer = 0;
      if(valueA>valueB)
        comparer = -1;
      else if(valueA<valueB)
        comparer = 1;

      return comparer;

  }
