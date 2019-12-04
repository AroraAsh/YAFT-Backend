import mongoose from 'mongoose'

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
  }
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