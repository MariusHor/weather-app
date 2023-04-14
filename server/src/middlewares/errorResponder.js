const errorResponder = (err, req, res, next) => {
  const status = err.status || 400;

  res.status(status).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });

  next(err);
};

export default errorResponder;
