import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const createBlog = async (req, res) => {
    const { title, blog_content, category} = req.body;
    console.log(req.body);
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
    console.log(blog_img);
    const blog = new Blog({
        title,
        "blog_content" : blog_content || "",
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

    if (blog.blog_img) {
        console.log(blog.blog_img);
    
        // Extract the publicId from the URL
        const publicId = blog.blog_img.split('/').slice(-1)[0].split('.')[0];
        // const getPublicId = (imageURL) => imageURL.split("/").pop().split(".")[0];
        console.log(publicId);
        try {
            const img = await deleteFromCloudinary(publicId);
            console.log(img);
        } catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
        }
    }


    await Blog.findByIdAndDelete(blog_id);
    
    const req_user = await User.findById(req.user._id).populate('blogs');
    return res.status(200).json({message: 'successfully deleted blog', req_user});
}

const updateBlog = async (req, res) => {
    const{blog_id, title, blog_content, category} = req.body;
    
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
        return res.status(400).json({message: 'You are not authorized to update this blog'});
    }
    

    await Blog.findByIdAndUpdate(blog_id, {title, blog_content, category});
    
    const req_user = await User.findById(req.user._id).populate('blogs');
    return res.status(200).json({message: 'successfully updated blog', req_user});
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
    if(user.stars.includes(blog_id)){
        return res.status(200).json({message: 'Blog already saved'});
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

const latest_blogs = async (req, res) => {
    const blogs = await Blog.find().sort({createdAt: -1}).limit(10).populate({
        path: 'created_by',
        select: 'username user_img'
    });
    res.status(200).json({message:"getting latest blogs successful", blogs});
}

const category_blogs = async (req, res) => {
    const {category} = req.body;
    console.log("category -> ", category);
   
    const blogs = await Blog.find({category}).populate({path : 'created_by', select : 'username user_img'}).sort({createdAt: -1}).limit(10);
    if(!blogs){
        return res.status(400).json({message: 'No blogs found'});
    }
    res.status(200).json({message:"getting latest category blogs successful", blogs});
}

const search_blogs_or_users = async (req, res) => {
    const {search} = req.body;
    const blogs = await Blog.find({title: {$regex: search, $options: 'i'}}).populate({path : 'created_by', select : 'username user_img'}).sort({createdAt: -1}).limit(10);
    const users = await User.find({username: {$regex: search, $options: 'i'}}).select('username user_img');
    if(!blogs && !users){
        return res.status(400).json({message: 'No blogs or users found'});
    }
    res.status(200).json({message:"getting search results successful", blogs, users});
}

const getBlog = async (req, res) => {
    const { blogId } = req.body;
    console.log(blogId);
    try {
        const blog = await Blog.findById(blogId)
            .populate({
                path: 'created_by',
                select: 'username user_img'
            })
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'comment_by',
                        select: 'username user_img'
                    },
                    {
                        path: 'reply',
                        populate: {
                            path: 'comment_by',
                            select: 'username user_img'
                        }
                    }
                ]
            });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        return res.status(200).json({ message: 'Blog fetched successfully', blog });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export { createBlog,
        deleteBlog,
        updateBlog,
     star_blog,
      unstar_blog,
     user_blogs,
     get_star_blogs,
        latest_blogs,
        category_blogs,
        search_blogs_or_users,
        getBlog,
    };