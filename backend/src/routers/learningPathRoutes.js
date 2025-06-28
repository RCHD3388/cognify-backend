const { Router } = require("express");
const learningPathController = require("../controllers/learningPathController");

const router = Router();

router.post("/new", learningPathController.getLearningPaths);
router.get("/", learningPathController.getAllLearningPaths);
router.post("/", learningPathController.saveLearningPath);

module.exports = router;