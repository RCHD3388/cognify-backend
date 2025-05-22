const { Router } = require("express");

const router = Router()

router.use("/auth", require("./authRoutes"));
router.use("/smart", require("./learningPathRoutes"));

module.exports = router;