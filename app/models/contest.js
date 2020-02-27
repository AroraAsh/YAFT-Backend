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
            joinDate:{type:Date}
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
    },
    
    
});




const Contest = mongoose.model('Contest',contestSchema)
module.exports = Contest