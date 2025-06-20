const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.register = catchAsync(async (req, res, next) => {
  const { firebaseId, email, name, role } = req.body;

  try {
    // check fields
    if (
      firebaseId !== undefined &&
      email !== undefined &&
      name !== undefined &&
      role !== undefined
    ) {
      // create new user
      const newUser = await db.User.create({ firebaseId, email, name, role });
      return setBaseResponse(res, RSNC.CREATED, {
        message: "User created successfully",
        data: newUser,
      });
    } else {
      return next(new AppError("Missing required fields", RSNC.BAD_REQUEST));
    }
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});

exports.getLoginUser = catchAsync(async (req, res, next) => {
  const { firebaseId } = req.params;
  console.log(req.params);
  try {
    // check fields
    if (firebaseId !== undefined) {
      // get user
      const user = await db.User.findOne({ where: { firebaseId } });
      if (user) {
        return setBaseResponse(res, RSNC.OK, {
          message: "User retrieved successfully",
          data: user,
        });
      } else {
        return next(new AppError("User not found", RSNC.NOT_FOUND));
      }
    } else {
      return next(new AppError("Missing firebaseId", RSNC.BAD_REQUEST));
    }
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});
