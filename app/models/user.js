const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityType = require('./activityType.js');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const FriendRequestStatus = Object.freeze({
  Requested: 'REQ',
  Accepted: 'ACC',
  Rejected: "REJ"
});

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
      validator: function (v) {
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
  height: {
    type: Number,
    min: [0, "Height must be over 0"]
  },
  stepGoal: {
    type: Number,
    min: [0, "Goal must be over 0"]
  },
  distanceGoal: {
    type: Number,
    min: [0, "Goal must be over 0"]
  },
  calorieGoal: {
    type: Number,
    min: [0, "Goal must be over 0"]
  },
  activityGoal: {
    type: Number,
    min: [0, "Goal must be over 0"]
  },
  sleepGoal: {
    type: Number,
    min: [0, "Goal must be over 0"]
  },
  weights: [
    {
      weight: {
        type: Number,
        min: [0, "Weight must be over 0"]
      },
      date: {
        type: Date
      }
    }
  ],
  friendList: [{
    friendUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    requestStatus: {
      type: String,
      enum: ["REQ","ACC","REJ"]
    }
  }
  ],
  awards: [{
    name: {
      type: String
    },
    desc: {
      type: String
    },
    activityType: {
      type: String,
      enum: Object.values(ActivityType)
    },

  }]
});


userSchema.statics.findByLogin = async function (email) {
  return await this.findOne({ email: email })
};

userSchema.statics.login = async function (email, password) {
  user = await this.findOne({ email: email });

  if (!user) {
    return null;
  }

  const match = bcrypt.compareSync(password, user.passwordHash);
  if (match) {
    return user;
  } else {
    return null;
  }
}

userSchema.statics.loginByToken = async function (token) {
  [userId, token] = token.split(" ");

  var user
  try {
    user = await this.findOne({ _id: userId })
  } catch (e) {
    throw new Error("User does not exist")
  }
  if (!user || !user.token) {
    throw new Error("User does not exist")
  }

  var match = bcrypt.compareSync(token, user.token)
  if (match) {
    return user
  } else {
    throw new Error("Token does not match")
  }
}

userSchema.statics.generateToken = async function (user) {
  var token = crypto.randomBytes(64).toString('hex');
  var tokenString = user._id + " " + token;

  user.token = bcrypt.hashSync(token, saltRounds);

  await user.save();

  return tokenString;
}

userSchema.statics.deleteToken = async function (userId) {
  return await this.findByIdAndUpdate(userId, { token: null })
}

userSchema.statics.register = async function (userAttributes) {
  var user = new this();

  user.name = userAttributes.name;
  user.email = userAttributes.email;
  user.age = userAttributes.age;
  user.gender = userAttributes.gender;
  user.passwordHash = bcrypt.hashSync(userAttributes.password, saltRounds);

  return await user.save()
}

userSchema.statics.update = async function (email, userUpdate) {
  var user = await this.findOne({ email: email })
  if (!user) {
    throw new Error("User does not exist")
  }

  Object.keys(userUpdate).forEach(function (key, index) {
    if (userUpdate[key]) {
      user[key] = userUpdate[key];
    }
  })

  await user.validate()

  return await user.save()
}

userSchema.statics.addWeight = async function (userID, weight, date) {
  var user = await this.findOne({ _id: userID })
  if (!user) {
    throw new Error("User does not exist")
  }

  user.weights.push({ weight: weight, date: date })

  await user.validate();

  return await user.save()

}

userSchema.statics.updateWeight = async function (userID, weightId, weight, date, deleteWeight) {
  var user = await this.findOne({ _id: userID })
  if (!user) {
    throw new Error("User does not exist");
  }

  var index = user.weights.findIndex(function (weight) {
    return weight._id == weightId;
  });
  if (index == -1) {
    throw new Error("Weight does not exist");
  }

  if (deleteWeight) {
    user.weights.splice(index, 1)
  } else {
    user.weights[index].weight = weight;
    user.weights[index].date = date;
  }

  await user.validate();

  return await user.save()

}

userSchema.statics.updatePassword = async function (email, oldPassword, newPassword) {
  var user = await this.findOne({ email: email })
  if (!user) {
    throw new Error("User does not exist")
  }

  const match = bcrypt.compareSync(oldPassword, user.passwordHash);
  if (match) {
    user.passwordHash = bcrypt.hashSync(newPassword, saltRounds);
    return await user.save();
  } else {
    throw new Error("The old password provided is not correct.")
  }
}

userSchema.statics.friendRequest = async function (requestFromEmail, requestToEmailId) {
  var user = await this.findOne({ email: requestFromEmail })
  if (!user)
    throw new Error("User does not exist.")
  var userRequest = await this.findOne({ email: requestToEmailId })
  if (!user)
    throw new Error("Requested user does not exist.")
    userRequest.friendList.push({ friendUserId: user._id, requestStatus: FriendRequestStatus.Requested })
  return await userRequest.save();
}

userSchema.statics.confirmRequest = async function (requestFromEmail, requestToEmail) {

  var userConfirming = await this.findOne({ email: requestFromEmail })
  if (!userConfirming)
    throw new Error("Requested user 1 does not exist.")
    
    var userRequestFrom = await this.findOne({ email: requestToEmail })
    if (!userRequestFrom)
      throw new Error("Requested user does not exist.")
      console.log("Email:"+requestToEmail)
      console.log("ID:"+userRequestFrom._id)
  var index = userConfirming.friendList.findIndex(function (request) {
    console.log("IDFriends:"+request.friendUserId)
    return request.friendUserId.equals(userRequestFrom._id);
  });
  if (index == -1) {
    throw new Error("Friend does not exist");
  }

  
    userRequestFrom.friendList.push({ friendUserId: userConfirming._id, requestStatus: FriendRequestStatus.Accepted})
    userConfirming.friendList[index].requestStatus = FriendRequestStatus.Accepted;
    await userConfirming.validate();
    await userRequestFrom.save();
    return userConfirming.save();
}

userSchema.statics.getFriends = async function (userId){
 
  return await this.find({email: userId,"friendList.requestStatus":{$in:[FriendRequestStatus.Accepted]}},'name email friendList')
  .populate('friendList.friendUserId','name email gender weights height age stepGoal')
  if(!user)
    throw new Error("User does not exist")
  
    return await this.aggregate([
      // Start with a $match pipeline which can take advantage of an index and limit documents processed
      { $match : {
         "friendList.requestStatus": FriendRequestStatus.Accepted
      }},
      { $unwind : "$friendList" },
      { $match : {
        "friendList.requestStatus": FriendRequestStatus.Accepted
      }}
   ]).populate('friendList.friendUserId','name email stepGoal')
  
}


var model = mongoose.model('User', userSchema);
module.exports = model

