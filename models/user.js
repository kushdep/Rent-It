const { required } = require('joi')
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    requests: [
        {
            location: {
                type: Schema.Types.ObjectId,
                ref: 'RentLoc'
            },
            reqBy: { type: Schema.Types.ObjectId },
            requestedFor: {
                start: Date,
                end: Date,
            },
            idProof: {
                type: Number,
                unique: true
            },
            rent: {
                totalNights: Number,
                totalRent: Number
            }
        }
    ],
    approvals: [
        {
            location: Schema.Types.ObjectId,
            approvalBy: Schema.Types.ObjectId,
            approvalFor: {
                start: { type: Date },
                end: { type: Date }
            },
            approvalStatus: {
                type: String,
                enum: ['Pending', 'Approved', 'Rejected']
            },
            rent: {
                totalNights: Number,
                totalRent: Number
            }
        }
    ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)

