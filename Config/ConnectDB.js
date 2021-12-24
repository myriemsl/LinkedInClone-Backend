const mongoose = require ('mongoose');
require('dotenv').config({path:'./Config/.env'})

// Databse connection
const ConnectDB=async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI, 
            { useNewUrlParser: true,
              useUnifiedTopology: true,
            })
        console.log('database is SUCCESSFULLY connected')
    } catch (error) {
     console.log('database is NOT connected')   
    }
};

module.exports = ConnectDB;