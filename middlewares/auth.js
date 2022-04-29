import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

var checkUserAuth = async(req,res,next) => {
    let token 
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')) {
        try {
            token =authorization.split(' ')[1]

            if(token !== 'undefined') {
                //verify token
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            
            //get user from token 
            req.user = await UserModel.findById(userID).select('-password')
            next()
            }

        } catch (error) {
            console.log(error)
            res.status(401).send({"status":"failed", "message": "Unauthorized User"})
        }
    }

    if(!token) {
        res.status(401).send({"status":"failed", "message": "Unauthorized User no token"})
    }
}

export default checkUserAuth