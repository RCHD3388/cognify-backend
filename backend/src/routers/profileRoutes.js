const { Router } = require("express");
const profileController = require("../controllers/ProfileController");

const router = Router();

router.get("/user/:firebaseId", profileController.getProfile);

module.exports = router;
