import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res)=> {
    try{
    const {name, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user"
    });
    res.status(201).json({message: "User Created", user})
    }
    catch(err){
        res.status(400).json({Error: err.message})
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})

    if(!user){
        return res.status(404).json({ message: "User not found" });
}
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(404).json({ message: "Invalid Credentils" });
    }

    const token = jwt.sign(
        {id: user._id, role: user.role},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
    );
    res.status(200).json({message:"Login Sucessfull", token, role: user.role, id: user._id});
}
