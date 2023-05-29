import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { registerValidaton, loginValidaton, postValidaton } from "./validations.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(dotenv.config().parsed.MANGOOSE_KEY)
  .then(() => {
    console.log("DB ok");
  })
  .catch((error) => console.log("DB error", error));

const app = express();
app.use(express.json());

app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/login", loginValidaton, UserController.login);
app.post("/auth/register", registerValidaton, UserController.register);

app.post("/posts", checkAuth, postValidaton, PostController.create);
app.get("/posts", checkAuth, PostController.getAll);
app.get("/posts/:id", checkAuth, PostController.getOne);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    return console.log("server ok!");
  }
});
