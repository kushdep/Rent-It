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
            location: { type: Schema.Types.ObjectId, },
            reqBy: {
                username: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                    unique: true
                },
                idProof: Number
            },
            reqForDates: {
                start: { type: Date },
                end: { type: Date }
            },

            rentDetails: {
                totalNights: Number,
                totalRent: Number
            },
            reqStatus: {
                type: String,
                enum: ['Pending', 'Approved', 'Rejected']
            },

        }
    ],
    bookings: [
        {
            locDetails: {
                title: String,
                images: [
                    {
                        url: String,
                        filename: String
                    }
                ],
                price: Number,
                description: String,
                location: String,
            },
            locOwnerDetails: {
                username: String,
                email: {
                    type: String,
                    required: true
                }
            },
            bookingDates: {
                start: { type: Date },
                end: { type: Date }
            },
            bookingStatus: {
                type: String,
                enum: ['Pending', 'Approved', 'Rejected']
            },
            rentDetails: {
                totalNights: Number,
                totalRent: Number
            }
        }
    ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)

