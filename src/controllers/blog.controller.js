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

const deleteBlog = async (req, res) => {
    const{blog_id} = req.body;
    if(!blog_id){
        return res.status(400).json({message: 'blog_id is required'});
    }
    if(!req.user){
        return res.status(400).json({message: 'login is required'});
    }
    const blog = await Blog.findById(blog_id);
    if(!blog){
        return res.status(400).json({message: 'Blog not found'});
    }
    console.log(blog.created_by,"----", req.user._id);
    if(blog.created_by.toString() != req.user._id.toString()){
        return res.status(400).json({message: 'You are not authorized to delete this blog'});
    }
    await Blog.findByIdAndDelete(blog_id);
    
    const req_user = await User.findById(req.user._id).populate('blogs');
    return res.status(200).json({message: 'successfully deleted blog', req_user});
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

const unstar_blog = async (req, res) => {
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
    user.stars = user.stars.filter(star => star != blog_id);
    await user.save();

    res.status(200).json({message: 'Blog unsaved successfully', user});
}

const get_star_blogs = async (req, res) => {
    const user = await User.findById(req.user._id).select("username user_img stars").populate('stars');
    if(!user){
        return res.status(400).json({message: 'User not found. || login is required'});
    }
    res.status(200).json({message: 'getting star blogs successful', user});

}

const user_blogs = async (req, res) => {
    const {username} = req.body;
    console.log("username", username);
    const blogs = await User.find({username,}).populate('blogs').select('blogs username user_img');
    res.status(200).json({message:"getting blogs successful", blogs});
}



export { createBlog,
        deleteBlog,
     star_blog, unstar_blog,
     user_blogs,
     get_star_blogs,
    };