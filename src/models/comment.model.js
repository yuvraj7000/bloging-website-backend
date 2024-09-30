import mongoose,{Schema} from "mongoose";

const commentSchema =new Schema({
    comment_by:{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    comment_text: {
        type: String,
        required: true,
    },
    reply: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    
},{timestamps: true})

export const Comment = mongoose.model('comment', commentSchema);