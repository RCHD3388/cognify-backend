const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCourse = catchAsync(async (req, res, next) => {
  try {
    const course = await db.Course.findAll();
    if (course) {
      return setBaseResponse(res, RSNC.OK, {
        message: "Course retrieved successfully",
        data: course,
      });
    } else {
      return next(new AppError("Course not found", RSNC.NOT_FOUND));
    }
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});

exports.getUserCourse = catchAsync(async (req, res, next) => {
  const { firebaseId } = req.params;
  try {
    const user = await db.User.findByPk(firebaseId);

    if (!user) {
      return setBaseResponse(res, RSNC.NOT_FOUND, {
        message: "User not found",
        data: course,
      });
    }

    console.log("tes");

    const enrolledCourses = await user.getEnrolledCourses({
      attributes: [
        "course_id",
        "course_name",
        "course_description",
        "course_rating",
      ],
      joinTableAttributes: ["createdAt"],
    });

    return setBaseResponse(res, RSNC.OK, {
      message: `Successfully retrieved enrolled courses for user ${user.name}`,
      data: enrolledCourses,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});
