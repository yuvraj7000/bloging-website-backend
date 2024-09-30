import 'dotenv/config'
import mongoose from "mongoose";




(async() =>{

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DATABASE}`)
        console.log('Database connected')
    }
    catch(error){
        console.log('Error connecting to the database', error)
    }
})()
