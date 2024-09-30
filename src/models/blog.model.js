import mongoose,{Schema} from "mongoose";

const blogSchema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title:{
        type: String,
        required: true,
     },
    blog_img: {
        type: String,
    },
    blog_content: {
        type: String,
        required: true,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],

},{timestamps: true})


export const Blog = mongoose.model('blog', blogSchema);