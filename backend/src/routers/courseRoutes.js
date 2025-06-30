const { Router } = require("express");
const courseController = require("../controllers/CourseController");

const router = Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // <-- 1. Impor modul 'fs' (File System)

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
      cb(null, `course_thumbnails/${uniqueSuffix}`); // Simpan dalam folder di dalam bucket
    },
  }),
});

// Penggunaan di router tetap sama
router.post(
  "/createCourse",
  upload.single("thumbnail"),
  courseController.createCourse
);

router.get("/getAllCourse", courseController.getAllCourse);
router.get(
  "/getUserCourse/:firebaseId",
  courseController.getUserEnrolledCourse
);
router.get("/search", courseController.getCourses);
router.get("/:courseId", courseController.getCourseById);
router.get("/courses/:firebaseId", courseController.getUserCreatedCourse);
router.get("/discussion/:courseId", courseController.getDiscussionsForCourse);
router.post("/discussion/:firebaseId", courseController.createDiscussionPost);
router.post(
  "/discussion/:parentId/reply/:firebaseId",
  courseController.createReply
);
router.post("/:courseId/payment", courseController.createPayment);
router.get(
  "/:courseId/check-enrollment/:firebaseId",
  courseController.checkEnrollment
);
router.post(
  "/:courseId/enroll-free/:firebaseId",
  courseController.enrollFreeCourse
);

module.exports = router;
