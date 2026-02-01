import jwt from "jsonwebtoken"
import multer, { diskStorage } from "multer";
import path from "path"
import User from "../models/user.model.js";

//protect admin route//

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
}

export const isAdmin = async(req, res, next) =>{
    if(req.user.role !== "admin"){
        return res.status(403).json({ message: "Access denied" });
  }
  next();
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "localstorage/")
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() +  path.extname(file.originalname))
    }
})

export const upload = multer({ 
    storage: storage
})

