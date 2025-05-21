const { Router } = require("express");
const catchAsync = require("../utils/catchAsync");
const { setBaseResponse, RSNC, setFailedResponse } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const { db } = require("../models");

const router = Router();

router.post("/register", catchAsync(async (req, res, next) => {
  const { firebaseId, email, name } = req.body;
  console.log(req.body);
  try {
    if(firebaseId !== undefined && email !== undefined && name !== undefined) {
      const newUser = await db.User.create({ firebaseId, email, name });
      return setBaseResponse(res, RSNC.CREATED, {
        message: "User created successfully",
        data: newUser
      })
    }else{
      return next(new AppError("Missing required fields", RSNC.BAD_REQUEST));
    }
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!'),
      500
    );
  }
}));

module.exports = router;