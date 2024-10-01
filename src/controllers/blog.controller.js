import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = async (req, res) => {
    const { title, blog_content, category} = req.body;
    if(!title || !blog_content){
        return res.status(400).json({message: 'title and content are required'});
    }
    const user = await User.findById(req.user._id);
    console.log(req.user._id);
    if(!user){
        return res.status(400).json({message: 'User not found. || login is required'});
    }

    const imageLocalPath = req.file?.path || "";
    const blog_img = imageLocalPath ? await uploadOnCloudinary(imageLocalPath) : "";
    
    const blog = new Blog({
        title,
        blog_content,
        category: category || "",
        created_by: user._id,
        blog_img: blog_img?.url || "",

    })

    await blog.save();

    user.blogs.push(blog._id);

    await user.save();

    res.status(200).json({message: 'Blog created successfully', blog, user});


} 

const star_blog = async (req, res) => {
    const {blog_id} = req.body;
    if(!blog_id){
        return res.status(400).json({message: 'blog_id is required'});
    }
    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(400).json({message: 'User not found. || login is required'});
    }

    const blog = await Blog.findById(blog_id);
    if(!blog){
        return res.status(400).json({message: 'Blog not found'});
    }
    user.stars.push(blog_id);
    await user.save();

    res.status(200).json({message: 'Blog saved successfully', user});

}



export { createBlog, star_blog };