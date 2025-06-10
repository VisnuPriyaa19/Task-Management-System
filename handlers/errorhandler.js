class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
 
const handleErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
 
  console.error(`[ERROR] ${statusCode}: ${message}`);
  res.status(statusCode).json({ error: message });
};
 
const categorizeError = (error) => {
  //  Server Error
  if (error instanceof TypeError || error instanceof SyntaxError) {
    return new ErrorHandler(500, "Server error occurred");
  }
 
  //  Authorization Errors
  if (error.type === "TOKEN_EXPIRED") {
    return new ErrorHandler(401, "Session expired, please log in again");
  }
  if (error.type === "INVALID_TOKEN") {
    return new ErrorHandler(403, "Invalid authorization token");
  }
 
  //  Database Failure
  if (error.name === "MongoNetworkError") {
    return new ErrorHandler(500, "Database connection failed");
  }
 
  //  Unexpected Error
  return new ErrorHandler(500, "An unexpected error occurred");
};
 
module.exports = { ErrorHandler, handleErrors, categorizeError };