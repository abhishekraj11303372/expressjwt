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
                    res.status(201).send({"status":"success", "message":"Registeraiton Success"})
                    } catch (error) {
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
}

export default UserController