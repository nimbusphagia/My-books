import { Router } from "express";
import { publishersGet, publishersPost } from "../controllers/publishers.js";


const publishersRouter = new Router();
publishersRouter.get('/publishers', publishersGet);
publishersRouter.post('/publishers', publishersPost);

export { publishersRouter };
