import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db/userModel.js";

import fs from "fs/promises";
import { sendEmail } from "../helpers/sendEmail.js";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchemas.js";


import path from "path";
import { fileURLToPath } from "url";
import gravatar from "gravatar";
import { HttpError } from "../helpers/HttpError.js";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {BASE_URL, JWT_SECRET } = process.env;

const avatarsDir = path.join(__dirname, "../public/avatars");

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
     throw HttpError(400, error.message);
    }

    const { email, password, subscription } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    

    const user = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      subscription,
      verify: false,
      verificationToken,
    });

    const verifyLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `<a href="${verifyLink}">Click to verify your email</a>`
    );

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw HttpError(401," Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401," Email is not verified");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw HttpError(401," Email or password is wrong");
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    await user.update({ token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      throw HttpError(401," Not authorized");
    }

    await user.update({ token: null }, 
      { where: { id: userId } }
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { error } = updateSubscriptionSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      throw HttpError(401," Not authorized");
    }

    await user.update({ subscription: req.body.subscription });

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};


export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.user) {
      throw HttpError(401," Not authorized");
    }

    if (!req.file) {
            throw HttpError(401," Avatar file is required");
    }

    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname);
    const filename = `${req.user.id}${ext}`;
    const resultPath = path.join(avatarsDir, filename);

    await fs.rename(tempPath, resultPath);

    const avatarURL = `/public/avatars/${filename}`; 

    await User.update(
      { avatarURL },
      { where: { id: req.user.id } }
    );

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ where: { verificationToken } });
    if (!user) {
      throw HttpError(404, "Verification succesful");
    }
    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw HttpError(400, "missing required field email");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyLink = `${BASE_URL}/api/auth/verify/${user.verificationToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `<a href="${verifyLink}">Click to verify your email</a>`
    ); 
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }};