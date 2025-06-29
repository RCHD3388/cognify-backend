const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const { default: axios, create } = require("axios");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { generateCompletePrompt, generateOutput, parseLearningPath } = require("../utils/geminiapi/controller");
const env = require("../config/env");
const { main_template } = require("../utils/geminiapi/template");

exports.getLearningPaths = catchAsync(async (req, res, next) => {
  let topic = req.body.topic || "Web Development";
  let level = req.body.level || "menengah";
  let additional_prompt = req.body.additional_prompt || "berikan learning path dengan steps sekitar 5-6 step saja.";

  try {
    let placeholder = { topic, level, additional_prompt }
    let completePrompt = generateCompletePrompt(main_template, placeholder);
    let result = await generateOutput(completePrompt);
    let formattedResult = parseLearningPath(result);
    formattedResult.level = level;

    return setBaseResponse(res, RSNC.OK, {
      message: "Learning paths retrieved successfully",
      data: formattedResult,
    });
  } catch (error) {

    console.error(error);
    return next(
      new AppError('There was an error. Try again later!', 401),
      401
    );
  }
});

const getFirstTwoCharUppercase = (text) => {
  if (!text) return "";
  return text.substring(0, 2).toUpperCase();
}

const getDateString = (date) => {
  const dateString = new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const [tanggal, bulan, tahun] = dateString.split(' ');
  return `${tanggal} ${bulan} ${tahun}`;
}

const getFormattedResult = (learningPath, learningPathSteps, comments = [], likes = []) => {
  return {
    id: learningPath.id,
    title: learningPath.title,
    description: learningPath.description,
    author_id: learningPath.user.firebaseId,
    author_name: learningPath.user.name,
    author_email: learningPath.user.email,
    createdAt: getDateString(learningPath.createdAt), // Placeholder, you can implement a real time ago function
    level: learningPath.level,
    tags: learningPath.tags ? learningPath.tags.split(", ").map(tag => tag.trim()) : [],
    likes: likes.map(like => ({
      id: like.id,
      userId: like.userId,
      smartId: like.smartId,
    })),
    comments: comments.map(comment => ({
      id: comment.id,
      userId: comment.userId,
      author_name: comment.author_name,
      author_email: comment.author_email,
      smartId: comment.smartId,
      content: comment.content,
      createdAt: getDateString(comment.createdAt), // Placeholder for comment creation date
    })), // Placeholder for comments
    steps: learningPathSteps.map(step => ({
      id: step.id,
      smartId: step.smartId,
      stepNumber: step.stepNumber,
      title: step.title,
      description: step.description,
      estimatedTime: step.estimatedTime
    }))
  }
}

exports.saveLearningPath = catchAsync(async (req, res, next) => {
  const { title, description, author, level, tags, steps } = req.body;
  console.log("Received data:", req.body);

  try {
    let newSmart = await db.Smart.create({
      title,
      description,
      level,
      tags: tags.join(", "), // Convert array to string
      owner: author, // Assuming 'author' is the Firebase ID of the user
    });

    let stepPromises = steps.map(async (step) => {
      let newStep = await db.smartstep.create({
        title: step.title,
        description: step.description,
        estimatedTime: step.estimatedTime,
        stepNumber: step.stepNumber,
        smartId: newSmart.id,
      });
      return newStep;
    });
    let newSteps = await Promise.all(stepPromises);

    let currentSmart = await db.Smart.findOne({
      where: { title, owner: author },
      include: [{
        model: db.User,
        as: 'user'
      }]
    });

    let result = getFormattedResult(currentSmart, newSteps);
    console.log("Formatted result:", result);

    return setBaseResponse(res, RSNC.OK, {
      message: "Learning path saved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!'),
      500
    );
  }
});

exports.getAllLearningPaths = catchAsync(async (req, res, next) => {
  try {
    let learningPaths = await db.Smart.findAll({
      include: [{
        model: db.User,
        as: 'user'
      }],
    });
    let allSteps = await db.smartstep.findAll();
    let allComments = await db.Comment.findAll();
    let allLikes = await db.Like.findAll();
    let formattedLearningPaths = learningPaths.map(learningPath => {
      let learningPathSteps = allSteps.filter(step => step.smartId === learningPath.id) || [];
      let comments = allComments.filter(comment => comment.smartId === learningPath.id) || [];
      let likes = allLikes.filter(like => like.smartId === learningPath.id) || [];
      return getFormattedResult(learningPath, learningPathSteps, comments, likes);
    });
    console.log("Formatted learning paths:", formattedLearningPaths);
    return setBaseResponse(res, RSNC.OK, {
      message: "Learning paths retrieved successfully",
      data: formattedLearningPaths,
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!', 401),
      401
    );
  }
});

exports.likeLearningPath = catchAsync(async (req, res, next) => {
  const { learningPathId } = req.params;
  const { userId } = req.body; // Assuming user ID is passed in the request body

  console.log("Received like request for learning path:", learningPathId, "by user:", userId);

  try {
    let targetId = 0;
    let existingLike = await db.Like.findOne({
      where: { smartId: learningPathId, userId }
    });

    if (existingLike) {
      targetId = existingLike.id;
      await db.Like.destroy({
        where: {
          smartId: learningPathId, userId
        }
      })
      return setBaseResponse(res, RSNC.OK, {
        message: "Learning path unliked successfully",
        data: {
          likeId: targetId,
          liked: false,
          message: "You have unliked this learning path.",
        },
      });

    } else {
      let newLike = await db.Like.create({
        smartId: learningPathId,
        userId
      });
      targetId = newLike.id;
      return setBaseResponse(res, RSNC.OK, {
        message: "Learning path liked successfully",
        data: {
          likeId: targetId,
          liked: true,
          message: "You have liked this learning path.",
        },
      });
    }
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!', 500),
      500
    );
  }
});

exports.getLearningPathCount = catchAsync(async (req, res, next) => {
  try {
    let count = await db.Smart.count();
    return setBaseResponse(res, RSNC.OK, {
      message: "Learning path count retrieved successfully",
      data: { count },
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!', 500),
      500
    );
  }
});

exports.addNewComment = catchAsync(async (req, res, next) => {
  const { learningPathId } = req.params;
  const { userId, content } = req.body;

  try {
    let user = await db.User.findOne({
      where: { firebaseId: userId }
    });
    if (!user) {
      return next(
        new AppError('User not found', 404),
        404
      );
    }

    let author_name = user.name;
    let author_email = user.email;

    let newComment = await db.Comment.create({
      userId,
      author_name,
      author_email,
      smartId: learningPathId,
      content
    });

    return setBaseResponse(res, RSNC.OK, {
      message: "Comment added successfully",
      data: {
        id: newComment.id,
        userId: newComment.userId,
        author_name: newComment.author_name,
        author_email: newComment.author_email,
        smartId: newComment.smartId,
        content: newComment.content,
        createdAt: getDateString(newComment.createdAt),
      },
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!', 500),
      500
    );
  }
});

exports.deleteLearningPath = catchAsync(async (req, res, next) => {
  const { learningPathId } = req.params;

  try {
    let learningPath = await db.Smart.findByPk(learningPathId);
    if (!learningPath) {
      return next(
        new AppError('Learning path not found', 404),
        404
      );
    }
    await db.Like.destroy({ where: { smartId: learningPath.id } });
    await db.Comment.destroy({ where: { smartId: learningPath.id } });
    await db.smartstep.destroy({ where: { smartId: learningPath.id } });
    
    await db.Smart.destroy({ where: { id: learningPath.id } });
    return setBaseResponse(res, RSNC.OK, {
      message: "Learning path deleted successfully",
      data: learningPath.id,
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError('There was an error. Try again later!', 500),
      500
    );
  }
});