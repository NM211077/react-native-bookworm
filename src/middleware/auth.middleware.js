import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
    try {
        //get token
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(401).json({message: "Token not found token, access denied"});

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(401).json({message: "Token is not valid"});

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({error: "Token is not valid"});
    }
}

export default protectRoute;