import mongoose,{Schema} from "mongoose";
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
    user_name: {
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



 export const User = mongoose.model('user', userSchema)