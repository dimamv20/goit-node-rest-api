import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db/userModel.js";

import fs from "fs/promises";


import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchemas.js";


import path from "path";
import { fileURLToPath } from "url";
import gravatar from "gravatar";
import { HttpError } from "../helpers/HttpError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsDir = path.join(__dirname, "../public/avatars");
const avatar = path.join(__dirname, "../public/avatars");

const JWT_SECRET = "ultra_super_secret_key_051220252102";

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
     throw HttpError(400, error.message);
    }

    const { email, password, subscription } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw HttpError(409, ' Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    

    const user = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      subscription,
    });

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