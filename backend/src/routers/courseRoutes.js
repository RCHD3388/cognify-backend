const { Router } = require('express');
const courseController = require('../controllers/CourseController');

const router = Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // <-- 1. Impor modul 'fs' (File System)

// Konfigurasi penyimpanan Multer yang sudah diperbaiki
const uploadDir = path.join(__dirname, '../public/uploads/course_thumbnails');

// Pastikan direktori ada, jika tidak, buat secara rekursif
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  // Tentukan direktori tujuan untuk file yang diunggah
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Gunakan path yang sudah dipastikan ada
  },
  // Tentukan bagaimana file harus dinamai
  filename: function (req, file, cb) {
    // Membuat nama file yang unik untuk menghindari konflik
    const uniqueSuffix = `course-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Penggunaan di router tetap sama
router.post(
  '/createCourse',
  upload.single('thumbnail'),
  courseController.createCourse
);

router.get('/getAllCourse', courseController.getAllCourse);
router.get('/getUserCourse/:firebaseId', courseController.getUserCourse);
router.get('/discussion/:courseId', courseController.getDiscussionsForCourse);
router.post('/discussion/:firebaseId', courseController.createDiscussionPost);
router.post(
  '/discussion/:parentId/reply/:firebaseId',
  courseController.createReply
);

module.exports = router;
