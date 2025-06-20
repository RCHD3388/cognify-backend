const { Router } = require("express");

const router = Router();

router.use("/auth", require("./authRoutes"));
router.use("/smart", require("./learningPathRoutes"));
router.use("/profile", require("./profileRoutes"));
router.use("/course", require("./courseRoutes"));

module.exports = router;
