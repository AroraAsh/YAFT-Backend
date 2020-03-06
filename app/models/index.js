const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user.js');
const Activity = require('./activity.js');
const Contest = require('./contest.js')

exports.User = User;
exports.Activity = Activity;
exports.Contest = Contest;