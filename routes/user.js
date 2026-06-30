import {Router} from 'express'
import { userModel } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const userRouter = Router()

userRouter.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                msg: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            msg: "User created successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

userRouter.post('/signin', async(req, res) => {
    const {email, password} = req.body
    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                msg: "User not found"
            })
        }
        const matched = bcrypt.compare(password, user.password)

        if(!matched){
            return res.json({
                msg: "Incorrect Password"
            })
        }

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET)

        return res.json({
            msg: "Login Successfully",
            token: token
        })

    } catch (error) {
        console.log(error)
        res.json({
            msg: "Internal Server Error"
        })
    }
})

export default userRouter