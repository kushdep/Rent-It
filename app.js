const express = require('express')
require('dotenv').config();
const ejsMate = require('ejs-mate')
const path = require('path')
const mongoose  = require('mongoose')
const RentLoc = require('./models/rentloc')
const methodOverride = require('method-override')
const morgan = require('morgan')

const app = express();

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

mongoose.connect(process.env.MONGODB_URL)

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.listen(3000,()=>{
     console.log('Server Running on port 3000')
})

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.engine('ejs',ejsMate)


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/rentloc',async(req,res)=>{
    const rentLoc = await RentLoc.find({})
    res.render('rentloc/index',{rentLoc})    
})

app.get('/rentloc/new',(req,res)=>{
    res.render('rentloc/new')
})


app.post('/rentloc',async(req,res)=>{
    const newData = new RentLoc(req.body.rentloc);
    await newData.save()
    console.log(newData._id)
    res.redirect(`rentloc/${newData._id}`)    
})

app.get('/rentloc/:id/edit',async(req,res)=>{
    const {id} = req.params
    const loc = await RentLoc.findById(id) 
    res.render('rentloc/edit',{loc})
})

app.get('/rentloc/:id',async(req,res)=>{
    const {id} = req.params
    const rentPlace = await RentLoc.findById({_id:id})
    res.render('rentloc/show',{rentPlace})    
})


app.put('/rentloc/:id',async(req,res)=>{
    const {id} = req.params
    const updatedData = await RentLoc.findByIdAndUpdate(id,{...req.body}.rentloc,{new:true})
    console.log(updatedData)
    res.redirect(`/rentloc/${updatedData._id}`)
})

app.delete('/rentloc/:id',async(req,res)=>{
    const {id} = req.params
    await RentLoc.findByIdAndDelete(id)
    res.redirect('/rentloc')
})


app.use((req,res)=>{
    res.status(404).send("404 NOT FOUND")
})