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
    requests: {
        locations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'RentLoc'
            }
        ]
    },
    approvals: {
        locations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'RentLoc'
            }
        ]
    }

})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)

