import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = async(req, res) => {
    const {fullname, email, username, password, description } = req.body;

    if(!fullname || !email || !username || !password){
        return res.status(400).json({message: 'All fields are required'});
    }

    const is_user_exist = await User.findOne(
        { $or :[{email: email},{username: username}]}
    );
    if(is_user_exist){
        return res.status(400).json({message: 'Username or email already exist'});
    }

    const imageLocalPath = req.file?.path || "";
    
    const image = imageLocalPath ? await uploadOnCloudinary(imageLocalPath) : "";
    const user = new User({
        fullname,
        email,
        username : username.toLowerCase(),
        password,
        description: description || "",
        user_img: image?.url || "",
    });
    console.log(user)
    await user.save();
    const created_user = await User.findById(user._id);
    console.log("userrrr ->",created_user)


   
    
    if(!created_user){
        return res.status(400).json({message: 'User not created'});
    }
    return res.status(200).json({message: 'User created successfully', user: created_user});


}


export { registerUser }
