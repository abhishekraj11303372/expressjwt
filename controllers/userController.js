import UserModel from "../models/User.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
    static userRegisteration = async(req,res) => {
        const {name, email, password, confirm_password, tc} = req.body
        const user = await UserModel.findOne({email:email})
        
        if(user){
            res.send({"status":"failed","message":"Email already exists"})
        } else {
            if(name && email && password && confirm_password && tc) {
                if(password===confirm_password) {
                    try {
                        const salt = await bycrypt.genSalt(10)
                        const hashPasswordd = await bycrypt.hash(password,salt)
                        const doc = new UserModel({
                        name: name,
                        email:email,
                        password:hashPasswordd,
                        tc:tc
                    })

                    await doc.save()

                    const saved_user =  await UserModel.findOne({email:email})

                    //JWT token
                    const token = jwt.sign({userID: saved_user._id},process.env.JWT_SECRET_KEY, {expiresIn:'3d'})

                    res.status(201).send({"status":"success", "message":"Registeraiton Success","token": token})

                    } catch (error) {
                        console.log("error")
                        res.send({"status":"failed", "message":"Unable to register"})
                    }
                } else {
                    res.send({"status":"failed", "message":"Password does not match"})
                }
            } else {
                res.send({"status":"failed", "message":"Alll fields are required"})
            }
        }
    } 

    static userLogin = async (req,res) => {
        try {
            const {email,password} =req.body
            if(email&&password) {
                const user = await UserModel.findOne({email:email});
                if(user!=null) {
                    const isMatch = await bycrypt.compare(password, user.password)
                    if(user.email === email && isMatch) {
                        //JWT token
                        const token = jwt.sign({userID: user._id},process.env.JWT_SECRET_KEY, {expiresIn:'3d'})
                        res.send({"status":"success","message":"Login success","token":token})
                    } else {
                        res.send({"status":"failed","message":"Your email or password is not valid"})
                    }

                } else {
                    res.send({"status":"failed","message":"You are not a Registered user"})
                }
            } else {
                res.send({"status":"failed", "message":"Alll fields are required"})
            }
        } catch (error) {
            res.send({"status":"failed","message":"Unable to login"})
        }
    }

    static changePassword = async(req,res) => {
        const {password,confirm_password} = req.body
        if(password && confirm_password) {
            if(password!==confirm_password) {
                res.send({"status":"failed", "message":"Password does not match"})
            } else {
                const salt = await bycrypt.genSalt(10)
                const newHashPassword = await bycrypt.hash(password,salt)
                await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newHashPassword}})
                res.send({"status":"success", "message":"Password changed successfully"})
            }
        } else {
            res.send({"status":"failed", "message":"Alll fields are required"})
        }
    }

    static loggedUser = async (req,res) => {
        res.send({"user":req.user})
    }

    static resetUserPasswordEmail = async (req,res) => {
        const {email} = req.body
        if (email) {
            const user = await UserModel.findOne({email:email})
            
            if(user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID:user._id},secret, {expiresIn:'15m'})
                const link =`http://127.0.0.1:3000/api/user/reset/${user.id}/${token}`
                console.log(link)
                res.send({"status":"success", "message":"Password reset success and email is sent. Please check your email"})
            } else {
                res.send({"status": "failed", "message":"Email does not exist"})
            }
        } else {
            res.send({"status": "failed", "message":"Email is required"})
        }
    }

    static userPasswordReset = async (req,res) => {
        const {password,confirm_password} =req.body
        const {id,token} = req.params
        const user = await UserModel.findById(id)
        const newToken = user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token,newToken)

            if(password && confirm_password) {
                if(password!==confirm_password) {
                    res.send({"status":"failed","message":"passwords doesnot match"})
                } else {
                const salt = await bycrypt.genSalt(10)
                const newHashPassword = await bycrypt.hash(password, salt)
                await UserModel.findByIdAndUpdate(user._id, {$set: {password: newHashPassword}})
                res.send({"status":"success", "message":"Password reset successfully"})
                }
            } else {
                res.send({"status":"failed","message":"All fields are required"})
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"invalid token"})
        }
    }
}

export default UserController