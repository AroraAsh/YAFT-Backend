const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new.mongoose.Schema({
    name:{
        type:String
    },
    startDateTime:{
        type:Date
    },
    endDateTime:{
        type:Date
    },
    userID:{type:Schema.Types.ObjectId, ref:'User'},
    activityType:{
        type:String,
        enum: Object.values(ActivityType)
    },
    distance:{type:Number,min:0},
    calories: {type:Number,min:0}
});

const Activity = mongoose.model('Activity',activitySchema)


export default Activity;