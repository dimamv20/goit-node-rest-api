import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const  tempDir = path.join(__dirname, "../", "temp");

const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        cb(null, "$(req,user.id)_$(Dtate.now())_$(file.originalname)");
    },
});


export const uploadMiddleware = multer({ storage });