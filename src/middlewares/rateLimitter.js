const redisClient = require('../lib/redisClient');

const rateLimiter = (rule) => {
  const { endpoint, rateLimit } = rule;
  return async (req, res, next) => {
    const ipAddress = req.ip;
    const redisId = `${endpoint}/${ipAddress}`;

    const requests = await redisClient.incr(redisId);
    if(requests === 1){
      await redisClient.expire(redisId, rateLimit.time);
    }
    if(requests > rateLimit.limit){
      return res.status(429).json({
        success: false,
        error: "too many requests",
      })
    }
    next();
  }   
} 


module.exports = rateLimiter;