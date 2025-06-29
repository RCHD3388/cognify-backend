const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const { default: axios } = require("axios");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { finalUrl } = require("../utils/geminiapi/controller");
const env = require("../config/env");

exports.getLearningPaths = catchAsync(async (req, res, next) => {
  console.log(env("GEMINI_API_KEY"));
  try {
    const response = await axios.post(
      `${finalUrl()}`,
      {
        contents: [{ parts: [{ text: "jelaskan secara singkat padat dan jelas apa itu Babi" }] }]
      }
    );
    // console.log(response.data);
    const result = response.data.candidates[0].content.parts[0].text;
    console.log(result);

    return setBaseResponse(res, RSNC.OK, {
      message: "Learning paths retrieved successfully",
      data: [
        prompt_response = result
      ],
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!'),
      500
    );
  }
});

exports.saveLearningPath = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { learningPathId } = req.body;
  console.log(req.params, req.body);
  try {
    return setBaseResponse(res, RSNC.SUCCESS, {
      message: "Learning path saved successfully",
      data: {
        userId,
        learningPathId,
      },
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!'),
      500
    );
  }
});