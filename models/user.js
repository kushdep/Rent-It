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
            location:{
            type: Schema.Types.ObjectId,
            ref: 'RentLoc'
            },
            rentedBy:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            From:Date,
            To:Date,
            idProof:{
                type:Number,
                unique:true
            }
        }
    ],
    approvals:[
        {
            location:{
            type: Schema.Types.ObjectId,
            ref: 'RentLoc'
            },
            approvalBy:{
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        }
    ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)

