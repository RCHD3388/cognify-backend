const { Router } = require("express");

const router = Router()

router.use("/auth", require("./authRoutes"));

module.exports = router;