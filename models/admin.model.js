import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    totalCopies: {
        type: Number,
        default: 1
    },
    availableCopies: {
        type: Number,
        default: 1
    }
},{timestamps: true})

export const BookModel = mongoose.model('Book', BookSchema)