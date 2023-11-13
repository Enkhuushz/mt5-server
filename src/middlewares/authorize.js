const basicAuth = require("basic-auth");

async function checkBasicAuth(req, res, next) {
  const unauthorized = (res) => {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    return res.sendStatus(401);
  };
  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  const username = user.name;
  const password = user.pass;

  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    return next();
  } else {
    return unauthorized(res);
  }
}

module.exports = {
  checkBasicAuth,
};
