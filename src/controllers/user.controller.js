import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateTokens = async(user_id) => {
    try{
        console.log("id ->",user_id)
        const user = await User.findById(user_id);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    }
    catch(error){
        console.log("error while generating tokens");
        console.log(error);
    }
}



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

const loginUser = async(req, res) => {
    const { email, username, password } = req.body;
   console.log(req.body)
    if((!email && !username)){
       return  res.status(400).json({message: 'username or email are required'});
    }
    if((!password)){
        return res.status(400).json({message: 'password is required'});
    }
    
    const user = await User.findOne({
        $or: [{email},{username}]
    });
    if(!user){
        return res.status(400).json({message: 'User not found'});
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        console.log("Invalid password")
       return res.status(400).json({message: 'Invalid password'});
    }
    
     const {accessToken, refreshToken} = await generateTokens(user._id);
    
     const login_user = await User.findById(user._id).select('-password -refreshToken');
    
     const options = {
        httpOnly : true,
        secure : true
      }

    return res.status(200).cookie('refreshToken', refreshToken, options).cookie('accessToken', accessToken, options).json({message: 'User logged in successfully', user: login_user});


}
    



export { registerUser, loginUser }
