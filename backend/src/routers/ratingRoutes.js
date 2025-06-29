const express = require("express");
const ratingController = require("../controllers/RatingController");

const router = express.Router();

router.get(
  "/:courseId/my-rating/:firebaseId",
  ratingController.getUserRatingForCourse
);

// GET /api/v1/courses/:courseId/ratings -> Lihat semua rating
router.get("/:courseId/ratings", ratingController.getRatingsForCourse);

// POST /api/v1/courses/:courseId/ratings -> Beri rating (butuh login)
router.post("/:courseId/ratings", ratingController.addOrUpdateRating);

module.exports = router;
