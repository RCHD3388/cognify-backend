const { Router } = require("express");
const catchAsync = require("../utils/catchAsync");
const { setBaseResponse, RSNC, setFailedResponse } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const { db } = require("../models");

const authController = require("../controllers/AuthController");

const router = Router();

router.post("/register", authController.register);

module.exports = router;