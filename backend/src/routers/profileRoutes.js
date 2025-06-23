const { Router } = require("express");
const profileController = require("../controllers/ProfileController");

const router = Router();

router.get("/getprofile/:firebaseId", profileController.getProfile);

module.exports = router;
