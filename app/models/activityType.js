const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityType = Object.freeze({
    Walking: 'WALKING',
    Cycling: 'BICYCLE',
    Running: 'RUNNING',
    Vehicle: 'VEHICLE',
    Sleeping: 'SLEEP'
})

exports = ActivityType;