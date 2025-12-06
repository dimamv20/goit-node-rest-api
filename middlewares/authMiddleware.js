import jwt from "jsonwebtoken";
import { User } from "../db/userModel.js";

const JWT_SECRET_KEY = "ultra_super_secret_key_051220252102";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            return res.status(401).json ({ message: 'Not authorized'});
        }
        
        const payload  = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findByPk (payload.id);

        if (!user || user.token !== token) {
            return res.status(401).json ({ message: 'Not authorized'});
        }

        req.user = {
            id: user.id,
            email: user.email,
            subscription: user.subscription,
        };

        next();
    } catch (error) {
        return res.status(401).json ({ message: 'Not authorized'});

        
    }
};
