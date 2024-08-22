import mongoose from 'mongoose';

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

export default mongoose.model('UserAttendance', UserAttendanceSchema);
