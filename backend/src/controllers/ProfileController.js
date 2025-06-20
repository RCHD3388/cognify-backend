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
