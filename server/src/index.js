const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const user = require('./routes/User');
const provider = require('./routes/provider');
const food = require ('./routes/foods')
const order = require('./routes/order')
const address = require('./routes/address');
const review  = require('./routes/review')

const CronJob = require('cron').CronJob;
const initialData = require('./routes/initialData')
const foodModel = require('./models/food')

const app = express()

env.config();
app.use(cors({
    origin: [
        'http://localhost:3000'], 
    methods: ['GET', 'PUT', 'POST','DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], 
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

var originsWhitelist = [
    'http://localhost:3000'
 ];
 var corsOptions = {
     origin: function(origin, callback){
         var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
         callback(null, isWhitelisted);
     },
     credentials:true
  }
app.use(cors(corsOptions))

mongoose.connect("mongodb+srv://lalitdhembre6:Lalit%23xandy123@cluster0.ujvrs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
    ssl:true
}).then(()=>{
    console.log("DataBase Connected")
})
const updateFood = async() =>{
    const foods = await foodModel.find()
    for(let i = 0;i<foods.length;i++){
        await foodModel.findByIdAndUpdate(foods[i]._id,{$set:{quantity:foods[i].enteredQuantity}});
    }
}
new CronJob('0 0 * * *', async () => {
    await updateFood()
  }, null, true, 'Asia/Kolkata');

app.get('/',(req,res) =>{
    console.log("Server Is Running")
    }
)
app.use('/api/v1/user', user);
app.use('/api/v1/provider',provider)
app.use('/api/v1/food',food)
app.use('/api/v1/order',order)
app.use('/api/v1/address',address);
app.use('/api/v1/review',review);
app.use('/api/v1/initialData',initialData)

app.listen(4000,()=>{
    console.log("Server is Running on port " + 4000)
})
