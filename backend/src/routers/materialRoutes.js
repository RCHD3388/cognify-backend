const { Router } = require("express");
const materialController = require("../controllers/MaterialController");
const path = require("path");
const router = Router();
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const env = require("../config/env");

// 1. Konfigurasi Klien S3
// Pastikan Anda telah mengatur environment variables:
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, dan AWS_REGION
const s3Client = new S3Client({
  region: env("AWS_REGION ") || "us-east-1", // Contoh: 'ap-southeast-1'
  credentials: {
    accessKeyId: env("AWS_ACCESS_KEY_ID"),
    secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
    sessionToken: env("AWS_SESSION_TOKEN"),
  },
});

// 2. Konfigurasi Multer dengan Multer-S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: env("AWS_BUCKET_NAME") || "bucket-storage-mdp", // Ganti dengan nama bucket S3 Anda
    metadata: function (req, file, cb) {
      // Anda bisa menambahkan metadata kustom di sini jika perlu
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Tentukan bagaimana file harus dinamai di S3
      const uniqueSuffix = `course-${Date.now()}${path.extname(
        file.originalname
      )}`;
      cb(null, `course_materials_document/${uniqueSuffix}`); // Simpan dalam folder di dalam bucket
    },
  }),
});
router.get("/materials/:sectionId", materialController.getMaterials);
router.post(
  "/materials/:sectionId",
  upload.array("files"),
  materialController.createMultipleMaterials
);

module.exports = router;
