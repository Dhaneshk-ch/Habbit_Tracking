// ─────────────────────────────────────────────
//  Auth Controller
//  POST /api/auth/register
//  POST /api/auth/login
//  GET  /api/auth/me
//  PUT  /api/auth/profile
// ─────────────────────────────────────────────
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: name.charAt(0).toUpperCase(),
    });

    const token = signToken(user._id);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, morningMotivation } = req.body;
    const user = await User.findById(req.user._id);

    if (name !== undefined) {
      user.name   = name.trim();
      user.avatar = name.trim().charAt(0).toUpperCase();
    }
    if (morningMotivation !== undefined) {
      user.morningMotivation = morningMotivation;
    }

    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
