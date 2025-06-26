const { Router } = require("express");
const profileController = require("../controllers/ProfileController");

const router = Router();

router.get("/getprofile/:firebaseId", profileController.getProfile);
router.patch("/updateMyProfile/:firebaseId", profileController.updateMyProfile);

module.exports = router;
