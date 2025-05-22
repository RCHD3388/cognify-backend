const { Router } = require("express");

const authController = require("../controllers/AuthController");

const router = Router();

router.post("/register", authController.register);
router.get("/login/:firebaseId", authController.getLoginUser);

module.exports = router;