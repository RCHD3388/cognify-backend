const { Router } = require("express");
const courseController = require("../controllers/CourseController");

const router = Router();

router.get("/getAllCourse", courseController.getAllCourse);
router.get("/getUserCourse/:firebaseId", courseController.getUserCourse);

module.exports = router;
