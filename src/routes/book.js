import { Router } from "express";
import { bookGet, bookPost } from "../controllers/book.js";

const bookRouter = new Router();
bookRouter.get('/book/:bookId', bookGet);
bookRouter.post('/book/:bookId', bookPost);
export { bookRouter };
