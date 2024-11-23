const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

function connectMongo(){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('Connected to MongoDB');
        
    }).catch((err)=>{
        console.log('Could Not connect to MongoDb\n', err);
        
    })
}

module.exports = connectMongo;