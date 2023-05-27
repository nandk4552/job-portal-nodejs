//error middleware || NEXT function
const errorMiddleware = (err, req, res, next) => {
  // console.log(err);

  //reusable object || default object
  const defaultErrors = {
    statusCode: 500,
    // message: ,
    message: err || "Something Went Wrong...",
  };

  //targeting the status codes
  //missing field error
  if (err.name === "ValidationError") {
    //overriding the default object with custom messages
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  //duplicate error
  if (err.code && err.code === 11000) {
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${Object.keys(
      err.keyValue
    )} field has to be unique`;
  }

  //getting response
  res.status(defaultErrors.statusCode).json({
    message: defaultErrors.message,
  });
};

export default errorMiddleware;
