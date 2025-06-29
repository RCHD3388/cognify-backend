const { Router } = require("express");
const { route } = require("./courseRoutes");

const router = Router();

router.use("/auth", require("./authRoutes"));
router.use("/smart", require("./learningPathRoutes"));
router.use("/profile", require("./profileRoutes"));
router.use("/course", require("./courseRoutes"));
router.use("/course", require("./ratingRoutes"));
router.use("/users", require("./followRoutes"));
router.use("/section", require("./sectionRoutes"));
router.use("/material", require("./materialRoutes"));

module.exports = router;
