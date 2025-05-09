const express = require('express')
const path = require('path')
const mongoose  = require('mongoose')
const RentLoc = require('./models/rentloc')

const app = express();

mongoose.connect('mongodb+srv://kushdep017:bbcc12aa@cluster0.jdq4d08.mongodb.net/RENT_IT')
.then(()=>{console.log("CONNECTED")})
.catch(err=>console.log(err))

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