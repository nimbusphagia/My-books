import { Router } from "express";
import { bookGet, bookPost } from "../controllers/book.js";
import { bookIdParam, editBookValidator } from "../validators/book.js";
import { validate } from "../middleware/validate.js";

const bookRouter = new Router();
bookRouter.get('/book/:bookId', bookIdParam, validate, bookGet);
bookRouter.post('/book/:bookId', editBookValidator, validate, bookPost);
export { bookRouter };
