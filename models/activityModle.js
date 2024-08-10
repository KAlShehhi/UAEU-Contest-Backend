const mongoose = require('mongoose');

const ActivitySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    type: {
        type: String,
        required: [true, 'Please add a type']
    },
    expectedAttendees: {
        type: Number,
        default: 0,
    },
    building: {
        type: String,
        required: [true, 'Please add a building']
    },
    room: {
        type: String,
        required: [true, 'Please add a room']
    },
    campus: {
        type: String,
        enum : ['MALE', 'FEMALE'],
        required: true
    },
    time: {
        type: String,
        required: [true, 'Please add a time']
    },
    date: {
        type: String,
        required: [true, 'Please add a date']
    },
    dateObject: {
        type: Date
    },
    attendees: {
        type: Number,        
        default: 0,
    },
    points: {
        type: Number,        
        default: 0,
    },
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);