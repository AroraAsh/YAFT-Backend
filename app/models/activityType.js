const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityType = Object.freeze({
    Walking: 'walking',
    Cycling: 'cycling',
    Running: 'running',
    Swimming: 'swimming',
    Sleeping: 'sleeping'
})

exports = ActivityType;