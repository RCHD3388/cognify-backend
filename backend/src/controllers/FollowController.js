const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Aksi untuk user (follower) mengikuti user lain (following)
exports.followUser = catchAsync(async (req, res, next) => {
  const followerId = req.user.firebaseId; // User yang sedang login
  const { userIdToFollow } = req.params; // User yang akan di-follow

  if (followerId === userIdToFollow) {
    return next(new AppError("You cannot follow yourself.", RSNC.BAD_REQUEST));
  }

  const follower = await db.User.findByPk(followerId);
  if (!follower)
    return next(new AppError("Follower not found.", RSNC.NOT_FOUND));

  // Gunakan "magic method" dari Sequelize: add<Alias>
  await follower.addFollowing(userIdToFollow);

  return setBaseResponse(res, RSNC.OK, {
    message: "Successfully followed user.",
  });
});

// Aksi untuk berhenti mengikuti user lain
exports.unfollowUser = catchAsync(async (req, res, next) => {
  const followerId = req.user.firebaseId;
  const { userIdToUnfollow } = req.params;

  const follower = await db.User.findByPk(followerId);
  if (!follower)
    return next(new AppError("Follower not found.", RSNC.NOT_FOUND));

  // Gunakan "magic method": remove<Alias>
  await follower.removeFollowing(userIdToUnfollow);

  return setBaseResponse(res, RSNC.OK, {
    message: "Successfully unfollowed user.",
  });
});

// Mendapatkan daftar user yang di-follow oleh seseorang
exports.getFollowing = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await db.User.findByPk(userId);
  if (!user) return next(new AppError("User not found.", RSNC.NOT_FOUND));

  // Gunakan "magic method": get<Alias>
  const followingList = await user.getFollowing({
    attributes: ["firebaseId", "name", "email", "role"], // Pilih data yang mau ditampilkan
  });

  return setBaseResponse(res, RSNC.OK, { data: followingList });
});

// Mendapatkan daftar user yang mengikuti seseorang (followers)
exports.getFollowers = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await db.User.findByPk(userId);
  if (!user) return next(new AppError("User not found.", RSNC.NOT_FOUND));

  const followersList = await user.getFollowers({
    attributes: ["firebaseId", "name", "email", "role"],
  });

  return setBaseResponse(res, RSNC.OK, { data: followersList });
});

exports.countFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return next(new AppError("User not found.", RSNC.NOT_FOUND));
    }

    // Gunakan "magic method" count<Alias> dari Sequelize
    const followingCount = await user.countFollowing();

    return setBaseResponse(res, RSNC.OK, {
      message: "Successfully retrieved following count.",
      data: {
        userId: userId,
        count: followingCount,
      },
    });
  } catch (error) {
    console.error("ERROR IN countFollowing 💥", error);
    return next(
      new AppError(
        "Something went wrong while counting following.",
        RSNC.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Menghitung jumlah user yang MENGIKUTI seseorang (followers)
exports.countFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return next(new AppError("User not found.", RSNC.NOT_FOUND));
    }

    // Gunakan "magic method" count<Alias> dari Sequelize
    const followersCount = await user.countFollowers();

    return setBaseResponse(res, RSNC.OK, {
      message: "Successfully retrieved followers count.",
      data: {
        userId: userId,
        count: followersCount,
      },
    });
  } catch (error) {
    console.error("ERROR IN countFollowers 💥", error);
    return next(
      new AppError(
        "Something went wrong while counting followers.",
        RSNC.INTERNAL_SERVER_ERROR
      )
    );
  }
};
