import dotenv from 'dotenv'
dotenv.config()
import express  from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT

app.use(cors())

app.listen(port, () => {
    console.log(`Server listening at htttp://localhost:${port}`)
})