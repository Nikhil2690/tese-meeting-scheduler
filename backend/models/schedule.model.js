import mongoose from "mongoose"

const scheduleSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true
    },
    surname: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required:true
    },
    timeZone: {
        type: String,
        required:true
    },
    location: { 
        type: String,
        default: "Google Meet" 
    },
    createdAt: { 
        type: Date,
        default: Date.now 
    }
})

export const Booking = mongoose.model("Schedule", scheduleSchema)