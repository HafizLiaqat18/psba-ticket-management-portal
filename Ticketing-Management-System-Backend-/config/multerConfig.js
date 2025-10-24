import multer from "multer";
import { join, extname } from "path";
import { existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure upload directory exists
const uploadFolder = join(__dirname, "../tickets-assets");
if (!existsSync(uploadFolder)) {
  mkdirSync(uploadFolder);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    const userId = req.user._id || "unknown";
    const timestamp = Date.now();

    const customName = `ticket-${userId}-${timestamp}${ext}`;
    cb(null, customName);
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow common image mime types
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB per file
  },
});

export default upload;
