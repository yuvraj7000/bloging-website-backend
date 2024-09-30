import 'dotenv/config'
import mongoose from "mongoose";
import app from './app.js';



(async() =>{

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DATABASE}`)
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.log('Error connecting to the database', error)
    }
})()
