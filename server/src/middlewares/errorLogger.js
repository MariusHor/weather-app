const errorLogger = (err, req, res, next) => {
  console.log(`error ${err.message}`);
  next(err);
};

export default errorLogger;
