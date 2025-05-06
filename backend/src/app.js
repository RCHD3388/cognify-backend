const cookieParser = require("cookie-parser");
const express = require("express");
const { default: helmet } = require("helmet");
const GlobalErrorController = require("./controllers/GlobalErrorController");
const AppError = require("./utils/appError");
const morgan = require("morgan");
const routers = require("./routers");
const env = require("./config/env");

const app = express();

// using security HTTP Header
app.use(helmet());

// body and cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// set development logging
if (env("APP_ENV") === 'development') {
    app.use(morgan("dev"));
}

// use app router
app.use("/api/v1", routers)

// not-found handler & global error control
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
})
// error controller for all error
app.use(GlobalErrorController)

module.exports = app;