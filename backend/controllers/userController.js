import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, password, contact, gender } = req.body;
        // Check if email already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ message: "Email Already Exists" });
        }
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            username, email, password: hashedPassword, contact, gender
        });

        // Respond with success
        res
            .status(201)
            .json({ message: "User Created Successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}