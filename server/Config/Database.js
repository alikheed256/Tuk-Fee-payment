const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database is connected successfully`);
    } catch(error){
        console.log(error)

    }
}
   
module.exports = connectDB;
