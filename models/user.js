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
            reqBy: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            requestedFor: {
                from: Date,
                to: Date,
            },
            idProof: {
                type: Number,
                unique: true
            },
            rent: Number
        }
    ],
    approvals: [
        {
            location: Schema.Types.ObjectId,
            approvedBy: Schema.Types.ObjectId,
            approvedFor: {
                start: { type: Date },
                end: { type: Date }
            },
            rent: Number
        }
    ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)

