const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.resolve(
  __dirname,
  '..',
  process.env.UPLOAD_DIR || 'uploads'
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadDirectory),
  filename: (req, file, callback) => {
    const extension = path.extname(path.basename(file.originalname)).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  }
});

function fileFilter(req, file, callback) {
  const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]);

  if (!allowedMimeTypes.has(file.mimetype)) {
    const error = new Error('Only JPEG, PNG, WebP, and PDF files are allowed.');
    error.statusCode = 400;
    return callback(error);
  }

  return callback(null, true);
}

const configuredMaxSize = Number(process.env.MAX_FILE_SIZE_BYTES);
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number.isFinite(configuredMaxSize) && configuredMaxSize > 0
      ? configuredMaxSize
      : 5 * 1024 * 1024
  }
});

module.exports = upload;