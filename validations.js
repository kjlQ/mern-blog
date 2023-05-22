import { body } from "express-validator";

export const loginValidaton = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Minimum length is 4").isLength({ min: 4 }),
];

export const registerValidaton = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Minimum length is 4").isLength({ min: 4 }),
  body("fullName", "Minimum length is 3").isLength({ min: 3 }),
  body("avatarUrl", "URL is incorrect").optional().isURL(),
];

export const postValidaton = [
  body("title", "Incorrect email").notEmpty(),
  body("text", "Minimum length is 4").notEmpty(),
  body("tags", "Minimum length is 3").optional().isString(),
  body("imageUrl", "URL is incorrect").optional().isURL(),
];
