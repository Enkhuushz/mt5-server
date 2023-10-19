const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const uuid4 = require('uuid').v4;
// import log from '../config/winston';


dotenv.config();

const { REFRESH_TOKEN_SECRET, JWT_SECRET, PRE_JWT_SECRET } = process.env;

function generatePreAccessToken(user){
  const options = {
    expiresIn: '10 minutes',
  };
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    PRE_JWT_SECRET,
    options,
  );
}

function verifyPreJwt(token){
  try{
    const obj = jwt.verify(token, process.env.PRE_JWT_SECRET);
    var user = {
      userId: obj.id,
      email: obj.email,
    };

    return user;
    
  }catch(err){
    console.log(`error during verifyPreJwt`);
    console.log(err);
  }
}

function generateAccessToken(user) {
  const options = {
    expiresIn: '60 minutes',
  };

  return jwt.sign(
    {
      //email: user.email,
      // social: user.social,
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    options,
  );
}

function verifyAccessToken(token){
  try{
    const obj = jwt.verify(token, JWT_SECRET);
    var user = {
      userId: obj.id,
      role: obj.role,
    };

    return user;
    
  }catch(err){
    console.log(`error during verifyAccessToken`);
    console.log(err);
  }
}

function generateRefreshToken(userId) {
  const options = {
    expiresIn: '1 days',
    issuer: 'api.horoscope.mn',
    audience: userId.toString(),
  };
  const uniqueKey = uuid4();
  const refreshToken = jwt.sign(
    {uniqueKey},
    REFRESH_TOKEN_SECRET,
    options,
  );
  return refreshToken;
}

function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        reject(new Error('User access is forbidden'));
      }
      const userId = payload.aud;
      resolve({
        ...payload,
        userId,
      });
    });
  });
}

module.exports = { 
  generateRefreshToken, 
  verifyRefreshToken, 
  generateAccessToken, 
  verifyAccessToken,
  generatePreAccessToken, 
  verifyPreJwt,
};
