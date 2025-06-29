const { Router } = require("express");
const learningPathController = require("../controllers/learningPathController");

const router = Router();

router.post("/new", learningPathController.getLearningPaths);
router.get("/", learningPathController.getAllLearningPaths);
router.post("/", learningPathController.saveLearningPath);
router.post("/like/:learningPathId", learningPathController.likeLearningPath);
router.post("/comment/:learningPathId", learningPathController.addNewComment);
router.get("/count", learningPathController.getLearningPathCount);

module.exports = router;