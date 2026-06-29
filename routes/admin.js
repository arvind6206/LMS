import { Router } from "express";
import { BookModel } from "../models/admin.model.js";

const adminRouter = Router();

adminRouter.post("/create", async (req, res) => {
  try {
    const { bookName, author, category } = req.body;
     if(bookName){
        return res.json({
            msg: "Book details is present already"
        })
    }
    await BookModel.create({
      bookName,
      author,
      category,
    });

    if (!bookName || !author || !category) {
      return res.status(404).json({
        msg: "Invalid credentials",
      });
    } else {
      res.status(201).json({
        msg: "Book added successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export default adminRouter;
