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
                        res.send({"status":"success","message":"Login success"})
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
}

export default UserController