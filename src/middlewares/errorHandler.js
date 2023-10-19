const logger = require('../config/winston');

const errorHandler = (err, req, res, next) => {
  //console.log(err.stack.blue);
  logger.log('error', `${err.stack.blue}`);

  res.status(err.statusCode || 500).json({
      success: false,
      error: err.message,
  });

}
module.exports = errorHandler;