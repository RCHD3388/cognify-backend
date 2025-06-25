const { Router } = require("express");
const courseController = require("../controllers/CourseController");

const router = Router();

router.get("/getAllCourse", courseController.getAllCourse);
router.get("/getUserCourse/:firebaseId", courseController.getUserCourse);
router.get("/discussion/:courseId", courseController.getDiscussionsForCourse);
router.post("/discussion/:firebaseId", courseController.createDiscussionPost);
router.post(
  "/discussion/:parentId/reply/:firebaseId",
  courseController.createReply
);
module.exports = router;
