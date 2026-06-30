import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import adminRouter from './routes/admin.js'
import userRouter from './routes/user.js'

dotenv.config()
const app = express()

app.use(express.json())

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)


async function main(){
    await mongoose.connect(process.env.MONGO_URI)
    app.listen(3000)
    console.log("Server listening on 3000")
}
main()