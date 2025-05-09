const express = require('express')
require('dotenv').config();
const path = require('path')
const mongoose  = require('mongoose')
const RentLoc = require('./models/rentloc')

const app = express();

mongoose.connect(process.env.MONGODB_URL)


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/makerentalloc',async(req,res)=>{
    const  LocDtls = new RentLoc({title:'Villa', price:400, description:"villa for party"})
    await LocDtls.save();
    res.send(LocDtls)
})

app.listen(3000,()=>{
     console.log('Server Running on port 3000')
})