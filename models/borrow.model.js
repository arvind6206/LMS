import mongoose from 'mongoose'

const borrowSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrowedAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    },
    returnedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["Borrowed", "Returned"],
        default: "Borrowed"
    }
}, {timestamps: true})

export const borrowModel = mongoose.model("Borrow", borrowSchema)