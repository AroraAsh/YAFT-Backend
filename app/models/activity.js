const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityType = require('./activityType.js');

const activitySchema = new mongoose.Schema({
    name:{
        type:String
    },
    startDateTime:{
        type:Date,
        required: [true, "Activity must have start time"]
    },
    endDateTime:{
        type:Date,
        require: [true, "Activity must have end time"]
    },
    userID:{
        type:Schema.Types.ObjectId, 
        ref:'User',
        required: [true, "Activity must have a user"]
    },
    activityType:{
        type:String,
        enum: ['walking', 'running', 'cycling', 'vehicle', 'sleeping'],
        required: [true, "Activity must have a type"]
    },
    distance:{
        type:Number,
        min:0,
        default: 0
    },
    calories: {
        type:Number,
        min:0,
        default: 0
    }
});

activitySchema.statics.insert = async function(activityAttributes){
    var activity = new this();

    activity.name = activityAttributes.name;
    activity.activityType = activityAttributes.activityType;

    activity.startDateTime = Date.parse(activityAttributes.startDateTime);
    if(isNaN(activity.startDateTime)){
        throw new Error("Start date could not be parsed");
    }

    activity.endDateTime = Date.parse(activityAttributes.endDateTime);
    if(isNaN(activity.endDateTime)){
        throw new Error("End date could not be parsed");
    }

    activity.userID = activityAttributes.userID;
    activity.stepCount = activityAttributes.stepCount;
    activity.duration = activityAttributes.duration;
    activity.caloriesBurned = activityAttributes.caloriesBurned;
    activity.distance = activityAttributes.distance;

    return await activity.save();
}


const Activity = mongoose.model('Activity',activitySchema)
module.exports = Activity