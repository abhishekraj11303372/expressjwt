import express from "express";
const router = express.Router();
import UserController from '../controllers/userController.js';
import checkUserAuth from "../middlewares/auth.js";

//route level middleware - to protect route
router.use('/changepassword',checkUserAuth)
router.use('/loggedUser',checkUserAuth)

//public routes
router.post('/register',UserController.userRegisteration)
router.post('/login',UserController.userLogin)
router.post('/resetUserPasswordEmail',UserController.resetUserPasswordEmail)

//protected routes
router.post('/changepassword',UserController.changePassword)
router.get('/loggedUser',UserController.loggedUser)

export default router;