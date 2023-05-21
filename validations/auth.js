import { body } from "express-validator";

export const registerValidaton = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Minimum length is 4").isLength({ min: 4 }),
  body("fullName", "Minimum length is 3").isLength({ min: 3 }),
  body("avatarUrl", "URL isn't correct").optional().isURL(),
];
