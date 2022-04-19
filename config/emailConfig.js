import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

let trasporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:false,
    auth: {
        user: process.env.EMAIL_USER, //Admin id
        pass: process.env.EMAIL_PASS, //Asmin pass
    },
})

export default trasporter