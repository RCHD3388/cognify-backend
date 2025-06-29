const express = require("express");

const followController = require("../controllers/FollowController");
const userController = require("../controllers/UserController");
const authController = require("../controllers/AuthController");

const router = express.Router();

// --- Rute yang bisa diakses publik ---
// GET /api/v1/users/:userId/following -> Lihat siapa saja yang di-follow oleh user :userId
router.get("/:userId/following", followController.getFollowing);

// GET /api/v1/users/:userId/followers -> Lihat siapa saja yang me-follow user :userId
router.get("/:userId/followers", followController.getFollowers);

// POST /api/v1/users/:userIdToFollow/follow -> User yang login akan me-follow user :userIdToFollow
router.post("/:userIdToFollow/follow", followController.followUser);

// DELETE /api/v1/users/:userIdToUnfollow/unfollow -> User yang login akan berhenti me-follow user :userIdToUnfollow
router.delete("/:userIdToUnfollow/unfollow", followController.unfollowUser);

router.get("/search", userController.searchUsers);

router.get("/users/:userId/following/count", followController.countFollowing);

// GET /api/v1/users/:userId/followers/count -> Hitung jumlah followers user :userId
router.get("/users/:userId/followers/count", followController.countFollowers);

module.exports = router;
