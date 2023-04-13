const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });

  next(err);
};

export default errorMiddleware;
