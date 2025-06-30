const { Router } = require("express");
const learningPathController = require("./../controllers/LearningPathController");

const router = Router();

router.post("/new", learningPathController.getLearningPaths);
router.get("/", learningPathController.getAllLearningPaths);
router.post("/", learningPathController.saveLearningPath);
router.delete("/:learningPathId", learningPathController.deleteLearningPath);
router.post("/like/:learningPathId", learningPathController.likeLearningPath);
router.post("/comment/:learningPathId", learningPathController.addNewComment);
router.get("/count", learningPathController.getLearningPathCount);

module.exports = router;