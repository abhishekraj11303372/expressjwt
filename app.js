import dotenv from 'dotenv'
dotenv.config()
import express  from 'express'
import cors from 'cors'
import connectDb from './config/connectdb.js'

const app = express()
const port = process.env.PORT

const DATABASE_URL = process.env.DATABASE_URL 

connectDb(DATABASE_URL)

app.use(cors())

app.use(express.json())

app.listen(port, () => {
    console.log(`Server listening at htttp://localhost:${port}`)
})

