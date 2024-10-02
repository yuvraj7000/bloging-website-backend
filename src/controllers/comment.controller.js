import { Comment } from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";

const add_comment = async (req, res) => {
    const { comment_text, blog_id } = req.body;
    if (!comment_text || !blog_id) {
        return res.status(400).json({ message: 'comment_text and blog_id are required' });
    }
    if (!req.user) {
        return res.status(400).json({ message: 'login is required' });
    }
    const comment = new Comment({
        comment_text,
        comment_by: req.user._id,
    });
    await comment.save();
    const blog = await Blog.findById(blog_id).populate('comments');
    blog.comments.push(comment._id);
    await blog.save();
    return res.status(200).json({ message: 'Comment added successfully', comment, blog });
}

const add_reply = async (req, res) => {
    const { comment_text, comment_id } = req.body;
    if (!comment_text || !comment_id) {
        return res.status(400).json({ message: 'comment_text and comment_id are required' });
    }
    if (!req.user) {
        return res.status(400).json({ message: 'login is required' });
    }
    const comment = new Comment({
        comment_text,
        comment_by: req.user._id,
    });
    await comment.save();
    const parent_comment = await Comment.findById(comment_id);
    parent_comment.reply.push(comment._id);
    await parent_comment.save();
    return res.status(200).json({ message: 'Reply added successfully', comment, parent_comment });
}

export { add_comment, add_reply }