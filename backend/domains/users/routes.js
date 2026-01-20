import "dotenv/config";
import { Router } from "express";
import User from "./model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const { JWT_SECRET_KEY } = process.env;

// ===================== GET USERS =====================
router.get("/", async (req, res) => {
  try {
    const userDoc = await User.find();
    res.json(userDoc);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ===================== PROFILE =====================
router.get("/profile", async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.json(null);

  try {
    const userInfo = jwt.verify(token, JWT_SECRET_KEY);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ===================== REGISTER =====================
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const encryptedPassword = bcrypt.hashSync(password, 10);

    const newUserDoc = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    const { _id } = newUserDoc;
    const newUserObj = { name, email, _id };

    const token = jwt.sign(newUserObj, JWT_SECRET_KEY);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      })
      .json(newUserObj);

  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// ===================== LOGIN =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      return res.status(400).json("Usuário não encontrado!");
    }

    const passwordCorrect = bcrypt.compareSync(password, userDoc.password);

    if (!passwordCorrect) {
      return res.status(400).json("Senha inválida!");
    }

    const { name, _id } = userDoc;
    const newUserObj = { name, email, _id };

    const token = jwt.sign(newUserObj, JWT_SECRET_KEY);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      })
      .json(newUserObj);

  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
