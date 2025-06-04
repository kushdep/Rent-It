const mongoose = require('mongoose')
const Schema = mongoose


const LocBookingSchema = new Schema({
    locOwner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    locDetails: {
        type: Schema.Types.ObjectId,
        ref: 'RentLoc'
    },
    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected']
    },
    bookedForDates: {
        start: { type: Date },
        end: { type: Date }
    },
    bookedBy: {
        username:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        idProof:Number
    },
    rent:{
        totalNights:Number,
        totalRent:Number
    }
})


const LocBooking = mongoose.model("LocBooking",LocBookingSchema)

module.exports = LocBooking
