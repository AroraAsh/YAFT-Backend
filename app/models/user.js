const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityType = require('./activityType.js');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must have an email"],
    validate: {
      validator: function(v){
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);;
      },
      message: () => "Email is not valid."
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  age: {
    type: Number,
    min: [0, "Age must be over 0"]
  },
  gender: {
    type: String,
    enum: ["M", "F", "O"]
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


userSchema.statics.findByLogin = async function(email){
    return await this.findOne({ email: email})
};

userSchema.statics.login = async function(email, password){
  user = await this.findOne({email: email});

  if(!user){
    return null;
  }

  const match = bcrypt.compareSync(password, user.passwordHash);
  if(match){
    return user;
  }else{
    return null;
  }
}

userSchema.statics.loginByToken = async function(token){
  [userId, token] = token.split(" ");

  var user 
  try{
    user = await this.findOne({_id: userId})
  }catch (e){
    throw new Error("User does not exist")
  }
  if(!user || !user.token){
    throw new Error("User does not exist")
  }

  var match = bcrypt.compareSync(token, user.token)
  if(match){
    return user
  }else{
    throw new Error("Token does not match")
  }
}

userSchema.statics.generateToken = async function(user){
  var token = crypto.randomBytes(64).toString('hex');
  var tokenString = user._id + " " + token;

  user.token = bcrypt.hashSync(token, saltRounds);

  await user.save();

  return tokenString;
}

userSchema.statics.deleteToken = async function(userId){
  return await this.findByIdAndUpdate(userId, {token: null})
}

userSchema.statics.register = async function(userAttributes){
  var user = new this();

  user.name = userAttributes.name;
  user.email = userAttributes.email;
  user.age = userAttributes.age;
  user.gender = userAttributes.gender;
  user.passwordHash = bcrypt.hashSync(userAttributes.password, saltRounds);
  
  return await user.save()
}

userSchema.statics.update = async function(email, userUpdate){
  var user =  await this.findOne({ email: email})
  if(!user){
    throw new Error("User does not exist")
  }

  Object.keys(userUpdate).forEach(function(key, index){
    if(userUpdate[key]){
      user[key] = userUpdate[key];
    }
  })

  return await user.save()
}

userSchema.statics.updatePassword = async function(email, oldPassword, newPassword){
  var user =  await this.findOne({ email: email})
  if(!user){
    throw new Error("User does not exist")
  }

  const match = bcrypt.compareSync(oldPassword, user.passwordHash);
  if(match){
    user.passwordHash = bcrypt.hashSync(newPassword, saltRounds);
    return await user.save();
  }else{
    throw new Error("The old password provided is not correct.")
  }
}

var model = mongoose.model('User', userSchema);
module.exports = model

