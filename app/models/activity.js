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
        // Note: If we use Object.values(ActivityType) the validation doesnt work for some reason
        enum: ['WALKING','BICYCLE','RUNNING','VEHICLE','SLEEP'],
        required: [true, "Activity must have a type"]
    },
    distance:{
        type:Number,
        min:0,
        default: 0
    },
    caloriesBurned: {
        type:Number,
        min:0,
        default: 0
    },
    stepCount: {
        type:Number,
        min:0,
        default: 0
    },
    duration: {
        type:Number,
        min:0,
        default: 0
    },
    locations:{
        type: {
            type: String,
            enum: ['MultiPoint']
          },
          coordinates: {
            type: [[Number]]
          }
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
    activity.locations.coordinates = activityAttributes.locations;

    return await activity.save();
}

activitySchema.statics.update = async function(userId, activityId, activityUpdate){
    var activity = await this.findOne({ _id: activityId, userID: userId})
    if(!activity){
      throw new Error("Activity does not exist or does not belong to this user")
    }

    Object.keys(activityUpdate).forEach(function(key, index){
        if(activityUpdate[key]){
          activity[key] = activityUpdate[key];
        }
      })

    await activity.validate();

    return await activity.save();
}


activitySchema.statics.getByTime = async function(start, end, userID){
    return await this.find({
        userID: userID, 
        startDateTime: { $lte: end}, 
        endDateTime: { $gte: start }
    })
}

activitySchema.statics.getById = async function(activityId, userID){
    return await this.find({
        userID: userID, 
        _id: activityId
    })
}


const Activity = mongoose.model('Activity',activitySchema)
module.exports = Activity