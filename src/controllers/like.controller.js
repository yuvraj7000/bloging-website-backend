import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";

const add_like = async (req, res) => {
    const { blog_id } = req.body;
    if (!blog_id) {
        return res.status(400).json({ message: 'blog_id is required' });
    }
    if (!req.user) {
        return res.status(400).json({ message: 'login is required' });
    }
    const blog = await Blog.findById(blog_id);
    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' });
    }




    if (blog.likes.includes(req.user._id)) {
        
        blog.likes = blog.likes.filter(like => like.toString() !== req.user._id.toString());
    await blog.save();
    const l = blog.likes.length;
    return res.status(200).json({ message: 'disLiked', blog, likes : l });
    }



    blog.likes.push(req.user._id);
    await blog.save();
    const l = blog.likes.length;
    return res.status(200).json({ message: 'Liked', blog, likes : l });
 }
 



 const remove_like = async (req, res) => {
    const { blog_id } = req.body;
    if (!blog_id) {
        return res.status(400).json({ message: 'blog_id is required' });
    }
    if (!req.user) {
        return res.status(400).json({ message: 'login is required' });
    }
    const blog = await Blog.findById(blog_id);
    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' });
    }
    if (!blog.likes.includes(req.user._id)) {
        return res.status(400).json({ message: 'You have not liked this blog' });
    }
    blog.likes = blog.likes.filter(like => like.toString() !== req.user._id.toString());
    await blog.save();
    const l = blog.likes.length;
    return res.status(200).json({ message: 'Like removed successfully', blog, likes : l });
 }

 export { add_like, remove_like };