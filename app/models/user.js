import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  friendList:[{type:Schema.Types.ObjectId, ref:'User'}],
  awards:[{
    name:{
      type:String
    },
    desc:{
      type:String
    },
    activityType:{
      type:String,
      enum: Object.values(ActivityType)
    },

  }]
});

userSchema.static.findByLogin = async function(login){
  let user = await this.findOne({ username: login });

  if(!user){
    user = await this.findOne({ email: login})
  }
  return user;
};

const User = mongoose.model('User', userSchema)

export default User;