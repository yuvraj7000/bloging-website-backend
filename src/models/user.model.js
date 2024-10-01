import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
 const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true,'password is required'],
    },
    user_img: {
        type: String,
        
    },
    description: {
        type: String,
        trim: true,
    },
    social: [
        {
            social_name: {
                type: String,
                required: true,
            },
            social_link: {
                type: String,
                required: true,
            }
        }
    ],
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'blog'
        }
    ],
    stars: [
        {
            type: Schema.Types.ObjectId,
            ref: 'blog'
        }
    ],
    refreshToken : {
        type: String
    }

 },{timestamps: true})



 userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id : this.id,
            email : this.email,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id : this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


 export const User = mongoose.model('user', userSchema)