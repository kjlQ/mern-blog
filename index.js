import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { registerValidaton } from "./validations/auth.js";
import { validationResult } from "express-validator";

import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

import dotenv from "dotenv";

mongoose
  .connect(dotenv.config().parsed.MANGOOSE_KEY)
  .then(() => {
    console.log("DB ok");
  })
  .catch((error) => console.log("DB error", error));

const app = express();

app.use(express.json());

app.get("/auth/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({
        message: "Not found",
      });
    }

    const { passwordHash, ...useeData } = user._doc;

    res.json({
      useeData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValid) {
      return res.status(400).json({
        message: "Icorrect login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...useeData } = user._doc;

    res.json({
      ...useeData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/auth/register", registerValidaton, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    return console.log("server ok!");
  }
});