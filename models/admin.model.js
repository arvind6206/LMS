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
    }
})

export const BookModel = mongoose.model('Book', BookSchema)