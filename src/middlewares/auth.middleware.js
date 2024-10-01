import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

const verifyJWT = (req, res, next) => {
    
    try{
        const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!Token){
        return res.status(401).json({message: "Unauthorized request"})
    }

    const decodedToken = jwt.verify(Token , process.env.ACCESS_TOKEN_SECRET)
    
    const user= User.findById(decodedToken?.id).select('-password -refreshToken')

    if(!user){
        return res.status(401).json({message: "Unauthorized request"})
    }

    req.user = user;
    next();
}
catch(error){
    return res.status(401).json({message: "invalid access token"})}

}

export { verifyJWT }