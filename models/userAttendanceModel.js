const mongoose = require('mongoose');

const UserAttendanceSchema = mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Activity'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

},{
    timestamps: true
});

module.exports = mongoose.model('UserAttendance', UserAttendanceSchema);