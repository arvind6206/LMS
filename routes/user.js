import {Router} from 'express'
import { userModel } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.js';
import { BookModel } from '../models/admin.model.js';
import { borrowModel } from '../models/borrow.model.js';

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

userRouter.post('/borrow/:bookId', authMiddleware, async(req, res) => {
    const userId = req.userId;
    const {bookId} = req.params;

    try {
        const findBook = await BookModel.findById(bookId)
        if(!findBook){
            return res.json({
                msg: "Book not found"
            })
        }
        if(findBook.availableCopies <= 0){
            return res.json({
                msg: "Book not available"
            })
        }
        //check if the user has alreday borrowed this book
        const alreadyBorrowed = await borrowModel.findOne({
            user: userId,
            book: bookId,
            status: "Borrowed"
        })

        if(alreadyBorrowed){
            return res.json({
                msg: "You have laready borrowed this book"
            })
        }

        // calculate due date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15)

        //create borrow record
        await borrowModel.create({
            user: userId,
            book: bookId,
            dueDate
        })
        await BookModel.findByIdAndUpdate(bookId, {
            $inc: {
                availableCopies: -1
            }
        });

        res.status(201).json({
            msg: "Book borrowed successfully",
            dueDate
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
})

userRouter.post("/return/:bookId", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { bookId } = req.params;

        const borrowedBook = await borrowModel.findOne({
            user: userId,
            book: bookId,
            status: "Borrowed"
        });

        if (!borrowedBook) {
            return res.status(404).json({
                msg: "You haven't borrowed this book"
            });
        }

        borrowedBook.status = "Returned";
        borrowedBook.returnedAt = new Date();

        await borrowedBook.save();

        await BookModel.findByIdAndUpdate(bookId, {
            $inc: {
                availableCopies: 1
            }
        });

        res.json({
            msg: "Book returned successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

userRouter.get("/history", authMiddleware, async (req, res) => {
    try {

        const history = await borrowModel.find({
            user: req.userId
        }).populate("book");

        res.json({
            history
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

export default userRouter