const { Router } = require("express");
const courseController = require("../controllers/CourseController");

const router = Router();
const multer = require("multer");
const path = require("path");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/course_thumbnails");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `course-${Date.now()}.${ext}`);
  },
});
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Batasi ukuran file hingga 5MB
  },
});
router.get("/getAllCourse", courseController.getAllCourse);
router.get("/getUserCourse/:firebaseId", courseController.getUserCourse);
router.get("/discussion/:courseId", courseController.getDiscussionsForCourse);
router.post("/discussion/:firebaseId", courseController.createDiscussionPost);
router.post(
  "/discussion/:parentId/reply/:firebaseId",
  courseController.createReply
);
router.post(
  "/createCourse",
  upload.single("thumbnail"),
  courseController.createCourse
);
module.exports = router;
