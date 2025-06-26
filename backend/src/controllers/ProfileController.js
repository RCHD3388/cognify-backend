const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const { default: axios } = require("axios");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { finalUrl } = require("../utils/geminiapi/controller");
const env = require("../config/env");
const { where } = require("sequelize");

exports.getProfile = catchAsync(async (req, res, next) => {
  try {
    const { firebaseId } = req.params;
    const user = await db.User.findOne({ where: { firebaseId } });
    // return res.send(user);
    if (user) {
      return setBaseResponse(res, RSNC.OK, {
        message: "Profile retrieved successfully",
        data: user,
      });
    } else {
      return next(new AppError("User not found", RSNC.NOT_FOUND));
    }
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});

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
