//    Error class node js provide karvat hai jis se devlapment aashan ho jaye

// Api me aane vali error ako handle karne ke liye bannaya hai jis se api ki error ko hanlde kiya j sake

class ApiError extends Error {
  constructor(
    statusCode,
    message = "somthing went wrong ",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    ((this.data = null),
      (this.message = message),
      (this.success = false),
      (this.errors = errors));

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
