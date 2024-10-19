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
        secure : true,
        sameSite: 'None'
      }

    return res.status(200).cookie('refreshToken', refreshToken, options).cookie('accessToken', accessToken, options).json({message: 'User logged in successfully', user: login_user});


}

const logoutUser = async(req,res)=> {
   

        await User.findByIdAndUpdate(req.user._id,{
          $unset:{
            refreshToken : 1
          }},{
            new : true
          }
        )
      
        const options ={
          httpOnly : true,
          secure : true
        }
        
        console.log(req.user)
      
        res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({message: "User logged out successfully"})
      
      
     
}


const myProfile = async(req, res) => {
    if(!req.user){
        return res.status(400).json({message: 'login is required'});
    }
    const user = await User.findById(req.user._id).select('-password -refreshToken').populate('blogs').populate('stars');
    return res.status(200).json({message: 'getting user successful', user});
}


const userProfile = async(req, res) => {
    const {username} = req.body;
    const user = await User.findOne({username}).select('-password -refreshToken -stars').populate('blogs');
    if(!user){
        return res.status(400).json({message: 'User not found'});
    }
    return res.status(200).json({message: 'getting user successful', user});
}


const editProfile = async(req, res) => {
    const {fullname, email, description } = req.body;
    if(!req.user){
        return res.status(400).json({message: 'login is required'});
    }
    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(400).json({message: 'User not found'});
    }
    if(fullname){
        user.fullname = fullname;
    }
    if(email){
        user.email = email;
    }
    if(description){
        user.description = description;
    }
    await user.save();
    return res.status(200).json({message: 'User updated successfully', user});
}

const addSocial = async (req, res) => {
    const { social_name, social_link } = req.body;

    if (!req.user) {
        return res.status(400).json({ message: 'Login is required' });
    }

    if (!social_name || !social_link) {
        return res.status(400).json({ message: 'Social name and link are required' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.social.push({ social_name, social_link });
        await user.save();

        return res.status(200).json({ message: 'Social link added successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





export { registerUser, loginUser, logoutUser, myProfile, userProfile, editProfile, addSocial}
