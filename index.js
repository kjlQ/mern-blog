import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";

import { registerValidaton, loginValidaton, postValidaton } from "./validations.js";

import checkAuth from "./utils/checkAuth.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(dotenv.config().parsed.MANGOOSE_KEY)
  .then(() => {
    console.log("DB ok");
  })
  .catch((error) => console.log("DB error", error));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const app = express();

const upload = multer({ storage });

app.use(express.json());

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/login", loginValidaton, UserController.login);
app.post("/auth/register", registerValidaton, UserController.register);

app.post("/posts", checkAuth, postValidaton, PostController.create);
app.get("/posts", checkAuth, PostController.getAll);
app.get("/posts/:id", checkAuth, PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.deletePost);
app.patch("/posts/:id", checkAuth, PostController.editPost);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    return console.log("server ok!");
  }
});
