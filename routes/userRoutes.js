import express from "express";
const router = express.Router();
import UserController from '../controllers/userController.js';

//public routes
router.post('/register',UserController.userRegisteration)
router.post('/login',UserController.userLogin)

//protected routes


export default router;