const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contestSchema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    startDateTime:{
        type:Date,
        required: [true, "Contest must have start time"]
    },
    endDateTime:{
        type:Date,
        require: [true, "Contest must have end time"]
    },
    creatorID:{
        type:Schema.Types.ObjectId, 
        ref:'User',
        required: [true, "Contest must have a creator"]
    },
    contestType:{
        type:String,
        enum:['PUBLIC','PRIVATE'],
        required:[true, 'Contest type must be defined']
    },
    contestGoalType:{
        type:String,
        enum:['STEPS','DISTANCE','LOCATION'],
        required:true
    },
    contestGoalValue:{
        type:Number
    },
    participant:[
        {
            userID:{ type: Schema.Types.ObjectId, ref: 'User' },
            joinDate:{type:Date},
            rank:{ type:Number},
            value: { type:Number}
        }
    ],
    locationStart:{
        type: {
            type: String,
            enum: ['Point']
          },
          coordinates: {
            type: [Number]
          }
    },
    locationEnd:{
        type: {
            type: String,
            enum: ['Point']
          },
          coordinates: {
            type: [Number]
          }
    }
    
});

contestSchema.statics.get = async function(user){
    return await this.find({})
    .populate('creatorID','name email location')
    .populate('participant.userID','name email location')
}



contestSchema.statics.insert = async function(contestAtt){
    var contest = new this();
    contest.name = contestAtt.name;
    contest.description = contestAtt.description;
    contest.startDateTime = Date.parse(contestAtt.startDateTime);
    if(isNaN(contest.startDateTime))
        throw new Error("Contest Start date could not be parsed");
    contest.endDateTime = Date.parse(contestAtt.endDateTime);
    if(isNaN(contest.endDateTime))
        throw new Error("Contest End date could not be parsed");
    contest.creatorID = contestAtt.creatorID;
    contest.contestType = contestAtt.contestType;
    contest.contestGoalType = contestAtt.contestGoalType;
    contest.contestGoalValue = contestAtt.contestGoalValue;
    contest.locationStart.coordinates = contestAtt.locationStart;
    contest.locationEnd.coordinates = contestAtt.locationEnd;

    return await contest.save();
}


contestSchema.statics.join = async function(contestId,user){
    var contest = await this.findOne({_id: contestId});
    if(!contest)
        throw new Error("Contest does not exist");

    var particip = {
        userID:user._id,
        joinDate:Date.now()
    }

    contest.participant.push(particip);
    await contest.validate();
    return contest.save();
}



const Contest = mongoose.model('Contest',contestSchema)
module.exports = Contest