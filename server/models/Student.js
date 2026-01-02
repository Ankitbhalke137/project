import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        default: 'Pune, Maharashtra'
    },
    avatar: {
        type: String,
        default: 'public/student_avatar_1.png'
    },
    batch: {
        type: Number,
        required: true,
        min: 2020,
        max: 2030
    },
    campus: {
        type: String,
        required: true,
        enum: ['Bengaluru', 'Pune', 'Hyderabad']
    },
    about: {
        type: String,
        default: 'A passionate School of Technology student exploring the future of innovation.'
    },
    portfolio: {
        type: String,
        default: 'https://github.com/'
    },
    achievements: {
        type: [String],
        default: ['Deans List', 'Hackathon Finalist']
    }
}, {
    timestamps: true
});

// Index for faster queries
studentSchema.index({ campus: 1, batch: 1 });
studentSchema.index({ name: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
