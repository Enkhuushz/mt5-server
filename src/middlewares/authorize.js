const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const jwtHelper = require('../lib/jwtHelper');

exports.verifyJwt = async(req, res, next) => {
  try{
    if(!req.headers.authorization){
      throw new CustomError('could not find the unauthorization in req.header', 401);
    };
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
      throw new CustomError('unauthorized', 401);
    };
    const obj = jwt.verify(token, process.env.JWT_SECRET);
    console.log('================');
    console.log(obj);
    req.userId = obj.id;
    req.role = obj.role;
    next();
  }catch(err){
    if(!err.statusCode){
      err.statusCode = 401;
    }
    next(err);
  }
}
exports.verifyPreJwt = async(req, res, next) => {
  try{
    if(!req.headers.authorization){
      throw new CustomError('could not find the unauthorization in req.header', 401);
    };
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
      throw new CustomError('unauthorized', 401);
    };
    const obj = jwt.verify(token, process.env.PRE_JWT_SECRET);
    console.log('================');
    console.log(obj);
    req.userId = obj.id;
    req.phoneNumber = obj.phoneNumber;
    next();
  }catch(err){
    if(!err.statusCode){
      err.statusCode = 401;
    }
    next(err);
  }
}
exports.isJwtAble = async (req, res, next) => {
  try{
    if(req.headers.authorization){
      const token = req.headers.authorization.split(' ')[1];
      if(!token){
        throw new CustomError('unauthorized', 401);
      };
      const obj = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = obj.id;
      req.role = obj.role;
    }
    next();
  }catch(err){
    if(!err.statusCode){
      err.statusCode = 401;
    }
    next(err);
  }
}
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if(!roles.includes(req.role)){
      throw new CustomError(`your role (${req.role}) is not allowed`, 403);
    };
    next();
  }
}