const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const { default: axios } = require("axios");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { finalUrl } = require("../utils/geminiapi/controller");
const env = require("../config/env");
const { where } = require("sequelize");

exports.getProfile = async (req, res, next) => {
  try {
    const { firebaseId } = req.params;
    const user = await db.User.findByPk(firebaseId, {
      // Kita tidak perlu include data lain, hanya user itu sendiri
      attributes: ["firebaseId", "name", "email", "role", "description"],
    });

    if (!user) {
      return next(new AppError("User not found", RSNC.NOT_FOUND));
    }

    // Hitung jumlah following dan followers secara terpisah
    const followingCount = await user.countFollowing();
    const followersCount = await user.countFollowers();

    // Ubah objek user menjadi JSON biasa agar bisa ditambahkan properti baru
    const userProfile = user.toJSON();

    // Tambahkan properti hitungan ke dalam objek
    userProfile.followingCount = followingCount;
    userProfile.followersCount = followersCount;

    return setBaseResponse(res, RSNC.OK, {
      message: "Profile retrieved successfully",
      data: userProfile, // Kirim objek yang sudah diperkaya
    });
  } catch (error) {
    console.error("ERROR IN getProfile 💥", error);
    return next(
      new AppError("There was an error retrieving the profile."),
      500
    );
  }
};

exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.params.firebaseId;

  // Ambil hanya field yang diizinkan untuk di-update
  const updateData = {};
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description; // Izinkan string kosong

  const [updatedRows] = await db.User.update(updateData, {
    where: { firebaseId: userId },
  });

  if (updatedRows === 0) {
    return next(
      new AppError("User not found or no data changed.", RSNC.NOT_FOUND)
    );
  }

  const updatedUser = await db.User.findByPk(userId);

  return setBaseResponse(res, RSNC.OK, {
    message: "Profile updated successfully",
    data: updatedUser,
  });
});
