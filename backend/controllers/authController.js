import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { compare } from "bcrypt";

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