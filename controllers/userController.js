import UserModel from "../models/User";
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
                    const doc = new UserModel({
                        name: name,
                        email:email,
                        password:password,
                        tc:tc
                    })

                    await doc.save()
                } else {
                    res.send({"status":"failed", "message":"Password does not match"})
                }
            } else {
                res.send({"status":"failed", "message":"Alll fields are required"})
            }
        }
    } 
}