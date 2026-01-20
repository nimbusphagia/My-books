import { body, query } from "express-validator";

export const indexGetValidator = [
  query("sortby")
    .optional()
    .isIn(["title", "year", "author", "publisher"])
];
export const createBookValidator = [
  body("action")
    .equals("create"),

  body("title")
    .trim()
    .isLength({ min: 1, max: 255 })
    .escape(),

  body("author_id")
    .isInt({ min: 1 })
    .toInt(),

  body("publisher_id")
    .isInt({ min: 1 })
    .toInt(),

  body("year")
    .optional({ nullable: true })
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .toInt(),

  body("description")
    .optional({ nullable: true })
    .trim()
    .escape(),

  body("isbn")
    .optional({ nullable: true })
];

export const deleteBookValidator = [
  body("action")
    .equals("delete"),

  body("bookId")
    .isInt({ min: 1 })
    .toInt(),

  body("password")
    .trim()
    .notEmpty()
];
