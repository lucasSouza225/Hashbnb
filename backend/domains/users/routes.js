import { Router } from "express";
import { connectDb } from "../../conf/db.js";
import User from "./model.js";
import bcrypt from "bcryptjs";

const router = Router();
const bcryptSalt = bcrypt.genSaltSync();

connectDb();

router.get("/", async (req, res) => {

    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    const encryptedPassoword = bcrypt.hashSync(password, bcryptSalt)
    try {
        const newUser = await User.create({
            name,
            email,
            password: encryptedPassoword,
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email })
        
        if (userDoc) {
            const passwordCorrect = bcrypt.compareSync(password, userDoc.password)
            const {name, _id} = userDoc

            passwordCorrect ? res.json({name, _id, email}) : res.status(400).json("Senha invalida!")
        } else {
            res.status(400).json("Usuario naão encontrato")
        }

    } catch (error) {
        res.status(500).json(error);
    }

})

export default router;