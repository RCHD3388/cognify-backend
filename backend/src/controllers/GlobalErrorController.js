const env = require("../config/env");
const { setFailedResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");

// send response for development env
const sendDevErr_Response = (err, errStack, req, res) => {
    return setFailedResponse(res, err.status, err.statusCode, err.message, err.errors, errStack);
}
// send response for production env
const sendProdErr_Response = (err, req, res) => {
    if (err.isOperational) {
        return setFailedResponse(res, err.status, err.statusCode, err.message, err.errors);
    } else {
        console.log('ERROR 💥', err)
        return setFailedResponse(res, err.status, err.statusCode, "Something went wrong ! Please try again later.")
    }
}

const handleDuplicateDataDB = err => {
    const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0].replaceAll('\"', '');

    const message = `Duplicate field value '${value}'. Please use another value!`;
    return new AppError(message, RSNC.BAD_REQUEST);
}

const handleObjectIdInvalid = err => {
    return new AppError(err.model.modelName + " with this ID not found", RSNC.NOT_FOUND)
}

const handleJWTError = () => {
    return new AppError('Invalid token. Please try again!', RSNC.UNAUTHORIZED);
}

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired! Please try again.', RSNC.UNAUTHORIZED);
}

// ========================================
// ===== global error main controller =====
// ========================================
module.exports = (err, req, res, next) => {
    // if status code ans status not exist
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    err.errors = err.errors || [];

    let error = { ...err};
    error.name = err.name;
    error.message = err.message;
    
    
    if (error.code === 11000) error = handleDuplicateDataDB(error);
    if(error.name === "JsonWebTokenError") error = handleJWTError();
    if(error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if(error.name === "CastError" && error.kind === "ObjectId") error = handleObjectIdInvalid(err);

    if (env("APP_ENV") === "development" || env("APP_ENV") === "testing") {
        sendDevErr_Response(error, err.stack, req, res);
    } else {
        sendProdErr_Response(error, req, res);
    }
}