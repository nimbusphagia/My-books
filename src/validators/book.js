import { param, body } from "express-validator";

export const bookIdParam = [
  param("bookId").isInt({ min: 1 }).toInt()
];


export const editBookValidator = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 255 })
    .escape(),

  body("author_id")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .toInt(),

  body("publisher_id")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .toInt(),

  body("year")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .toInt(),

  body("isbn")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isISBN()
    .withMessage("Invalid ISBN"),

  body("img_url")
    .optional({ nullable: true, checkFalsy: true })
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true
    })
    .withMessage("Image URL must be a valid http or https URL")
];

