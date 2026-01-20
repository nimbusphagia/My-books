import { Router } from "express";
import { indexGet, indexPost } from "../controllers/index.js";
import { validate } from "../middleware/validate.js";
import { createBookValidator, deleteBookValidator, indexGetValidator } from "../validators/index.js";

const indexRouter = new Router();

indexRouter.get('/', indexGetValidator, validate, indexGet);
indexRouter.post(
  "/",
  async (req, res, next) => {
    let validators = [];

    if (req.body.action === "create") {
      validators = createBookValidator;
    } else if (req.body.action === "delete") {
      validators = deleteBookValidator;
    }

    for (const validator of validators) {
      await validator.run(req);
    }

    next();
  },
  validate,
  indexPost
);


export { indexRouter };
