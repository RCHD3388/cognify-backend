const { Router } = require("express");
const { route } = require("./courseRoutes");

const router = Router();

router.use("/auth", require("./authRoutes"));
router.use("/smart", require("./learningPathRoutes"));
router.use("/profile", require("./profileRoutes"));
router.use("/course", require("./courseRoutes"));
router.use("/users", require("./followRoutes"));

module.exports = router;
