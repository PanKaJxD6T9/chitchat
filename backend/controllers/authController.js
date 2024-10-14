import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { compare } from "bcrypt";
import {renameSync, unlinkSync} from "fs"

const maxTime = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId)=>{
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxTime});
}

export const signup = async(req, res, next)=>{
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).send("Email and Password is Required !!!")
        }

        const user = await User.create({
            email: email,
            password: password,
        });

        res.cookie("jwt", createToken(email, user.id), {
            maxTime,
            secure: true,
            sameSite: "None"
        });

        return res.status(201).json({user: {
            id: user.id,
            email: user.email,
            // firstname: user.firstname,
            // lastname: user.lastname,
            // image: user.image,
            profileSetup: user.profileSetup,
        }});

    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}


export const login = async(req, res, next)=>{
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).send("Email and Password is Required !!!")
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).send("User Not Found !!!")
        }

        const auth = await compare(password, user.password);

        if(!auth){
            return res.status(404).send("Password is Incorrect !!!")
        }

        res.cookie("jwt", createToken(email, user.id), {
            maxTime,
            secure: true,
            sameSite: "None"
        });

        return res.status(200).json({user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            profileSetup: user.profileSetup,
            color: user.color,
        }});

    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}

export const getUserInfo = async(req, res, next)=>{
    try{

        const userData = await User.findById(req.userId);

        if(!userData){
            return res.status(404).send("User Not Found !!!")
        }


        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            image: userData.image,
            profileSetup: userData.profileSetup,
            color: userData.color,
        });

    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}

export const updateProfile = async(req, res, next)=>{
    try{
        const {userId} = req;
        const {firstName, lastName, color} = req.body; // Updated keys to match frontend

        if(!firstName || !lastName){
            return res.status(400).send("Firstname and Lastname are required") // Updated error message
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstname: firstName, lastname: lastName, color, profileSetup: true // Updated keys to match model
        }, {new: true, runValidators: true});

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            image: userData.image,
            profileSetup: userData.profileSetup,
            color: userData.color,
        });

    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}

export const addProfileImage = async(req, res, next)=>{
    try{
        if(!req.file){
            return res.status(400).send("File is Required")
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(req.userId, {image:fileName}, {new: true, runValidators: true})

        return res.status(200).json({
            image: updatedUser.image,
        });

    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}

export const removeProfileImage = async(req, res, next)=>{
    try{
        const {userId} = req;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).send("User Not Found");
        }

        if(user.image){
            unlinkSync(user.image);
        }

        user.image = null;

        await user.save();

        return res.status(200).send("Profile Image Removed");

    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}