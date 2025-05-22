const { Router } = require("express");
const learningPathController = require("../controllers/learningPathController");

const router = Router();

router.get("/new", learningPathController.getLearningPaths);
router.post("/", learningPathController.saveLearningPath);

module.exports = router;