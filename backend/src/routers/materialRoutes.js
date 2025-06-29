const { Router } = require('express');
const materialController = require('../controllers/MaterialController');
const path = require('path');
const router = Router();
const multer = require('multer');
const fs = require('fs');
const uploadDir = path.join(
  __dirname,
  '../../public/uploads/course_materials_document'
);

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
router.get('/materials/:sectionId', materialController.getMaterials);
router.post(
  '/materials/:sectionId',
  upload.array('files'),
  materialController.createMultipleMaterials
);

module.exports = router;
