const mongoose = require('mongoose')
const Schema = mongoose.Schema


const RentlocSchema = new Schema({
    title:String,
    price:Number,
    description:String,
    location:String    
})

const RentLoc = mongoose.model('RentLoc',RentlocSchema)

module.exports=RentLoc




 