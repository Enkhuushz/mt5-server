const https = require("https");
const crypto = require("crypto");
const buffer = require("buffer");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
require("dotenv").config();

const {
  MT5_SERVER_DEMO,
  MT5_USER_LOGIN_DEMO,
  MT5_WEBCLIENT_PASSWORD_DEMO,

  MT5_SERVER_LIVE,
  MT5_USER_LOGIN_LIVE,
  MT5_WEBCLIENT_PASSWORD_LIVE,
} = process.env;

function MT5Request(server, port) {
  this.server = server;
  this.port = port;
  this.https = new https.Agent();
  this.https.maxSockets = 1;
  // this.https.keepAlive = true;
}

MT5Request.prototype.ParseBodyJSON = function (error, res, body, callback) {
  var answer = null;
  try {
    answer = JSON.parse(body);
  } catch {
    console.log("Parse JSON error");
  }
  if (!answer) {
    callback && callback("invalid body answer");
    return null;
  }
  var retcode = parseInt(answer.retcode);
  if (retcode != 0) {
    callback && callback(answer.retcode);
    return null;
  }
  return answer;
};

MT5Request.prototype.Get = function (path, callback) {
  var options = {
    hostname: this.server,
    port: this.port,
    path: path,
    agent: this.https,
    headers: { Connection: "keep-alive" },
    rejectUnauthorized: false, // comment out this line if you use self-signed certificates
  };
  var req = https.get(options, function (res) {
    res.setEncoding("utf8");
    var body = "";
    res.on("data", function (chunk) {
      body += chunk;
    });
    res.on("end", function () {
      callback(null, res, body);
    });
  });
  req.on("error", function (e) {
    console.log(e);
    return callback(e);
  });
};

MT5Request.prototype.GetPromise = function (path) {
  return new Promise((resolve, reject) => {
    var options = {
      hostname: this.server,
      port: this.port,
      path: path,
      agent: this.https,
      headers: { Connection: "keep-alive" },
      rejectUnauthorized: false, // comment out this line if you use self-signed certificates
    };
    var req = https.get(options, function (res) {
      res.setEncoding("utf8");
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        console.log(res.statusCode);
        //resolve(JSON.parse(body))
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          console.log("json parse error");
          resolve(body);
        }
      });
    });
    req.on("error", function (e) {
      console.log(e);
      reject(e);
    });
  });
};

MT5Request.prototype.PostPromise = function (path, body) {
  return new Promise((resolve, reject) => {
    var options = {
      hostname: this.server,
      port: this.port,
      path: path,
      agent: this.https,
      method: "POST",
      headers: {
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": body.length,
      },
      rejectUnauthorized: false, // comment out this line if you use self-signed certificates
    };
    var self = this;
    var req = https.request(options, function (res) {
      res.setEncoding("utf8");
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        console.log(res.statusCode);
        resolve(JSON.parse(body));
      });
    });
    req.on("error", function (e) {
      console.log(e);
      reject(e);
    });
    req.write(body);
    req.end();
  });
};

MT5Request.prototype.ProcessAuth = function (answer, password) {
  //---
  var pass_md5 = crypto.createHash("md5");
  var buf = buffer.transcode(Buffer.from(password, "utf8"), "utf8", "utf16le");
  pass_md5.update(buf, "binary");
  var pass_md5_digest = pass_md5.digest("binary");
  //---
  var md5 = crypto.createHash("md5");
  md5.update(pass_md5_digest, "binary");
  md5.update("WebAPI", "ascii");
  var md5_digest = md5.digest("binary");
  //---
  var answer_md5 = crypto.createHash("md5");
  answer_md5.update(md5_digest, "binary");
  var buf = Buffer.from(answer.srv_rand, "hex");
  answer_md5.update(buf, "binary");
  //---
  return answer_md5.digest("hex");
};

MT5Request.prototype.ProcessAuthFinal = function (
  answer,
  password,
  cli_random
) {
  //---
  var pass_md5 = crypto.createHash("md5");
  var buf = buffer.transcode(Buffer.from(password, "utf8"), "utf8", "utf16le");
  pass_md5.update(buf, "binary");
  var pass_md5_digest = pass_md5.digest("binary");
  //---
  var md5 = crypto.createHash("md5");
  md5.update(pass_md5_digest, "binary");
  md5.update("WebAPI", "ascii");
  var md5_digest = md5.digest("binary");
  //---
  var answer_md5 = crypto.createHash("md5");
  answer_md5.update(md5_digest, "binary");
  answer_md5.update(cli_random, "binary");
  return answer.cli_rand_answer == answer_md5.digest("hex");
};

MT5Request.prototype.Auth = function (login, password, build, agent, callback) {
  if (!login || !password || !build || !agent) return;
  var self = this;
  self.Get(
    `/api/auth/start?version=${build}&agent=${agent}&login=${login}&type=manager`,
    function (error, res, body) {
      var answer = self.ParseBodyJSON(error, res, body, callback);
      if (answer) {
        var srv_rand_answer = self.ProcessAuth(answer, password);
        var cli_random_buf = crypto.randomBytes(16);
        cli_random_buf_hex = cli_random_buf.toString("hex");
        self.Get(
          "/api/auth/answer?srv_rand_answer=" +
            srv_rand_answer +
            "&cli_rand=" +
            cli_random_buf_hex,
          function (error, res, body) {
            var answer = self.ParseBodyJSON(error, res, body, callback);
            if (answer) {
              if (self.ProcessAuthFinal(answer, password, cli_random_buf))
                callback && callback(null);
              else callback && callback("invalid final auth answer");
            }
          }
        );
      }
    }
  );
  return true;
};

const getCredentials = (type) => {
  let SERVER, USER_LOGIN, WEBCLIENT_PASSWORD;
  if (type === MT5_SERVER_TYPE.LIVE) {
    SERVER = MT5_SERVER_LIVE;
    USER_LOGIN = MT5_USER_LOGIN_LIVE;
    WEBCLIENT_PASSWORD = MT5_WEBCLIENT_PASSWORD_LIVE;
  } else if (type === MT5_SERVER_TYPE.DEMO) {
    SERVER = MT5_SERVER_DEMO;
    USER_LOGIN = MT5_USER_LOGIN_DEMO;
    WEBCLIENT_PASSWORD = MT5_WEBCLIENT_PASSWORD_DEMO;
  } else {
    return false;
  }
  return { SERVER, USER_LOGIN, WEBCLIENT_PASSWORD };
};

const authAndGetRequest = async (path, type) => {
  const { SERVER, USER_LOGIN, WEBCLIENT_PASSWORD } = getCredentials(type);
  return new Promise((resolve, reject) => {
    const mt5Req = new MT5Request(`${SERVER}`, 443);
    mt5Req.Auth(
      `${USER_LOGIN}`,
      `${WEBCLIENT_PASSWORD}`,
      1985,
      "WebManager",
      async function (error) {
        if (error) {
          console.log(error);
          reject(error);
        }
        const res = await mt5Req.GetPromise(`${path}`);
        resolve(res);
      }
    );
  });
};

const authAndPostRequest = async (path, body, type) => {
  const { SERVER, USER_LOGIN, WEBCLIENT_PASSWORD } = getCredentials(type);
  return new Promise((resolve, reject) => {
    const mt5Req = new MT5Request(`${SERVER}`, 443);
    mt5Req.Auth(
      `${USER_LOGIN}`,
      `${WEBCLIENT_PASSWORD}`,
      1985,
      "WebManager",
      async function (error) {
        if (error) {
          console.log(error);
          reject(error);
        }
        console.log(`${path}`);
        console.log(JSON.stringify(body));
        const res = await mt5Req.PostPromise(`${path}`, JSON.stringify(body));
        resolve(res);
      }
    );
  });
};

module.exports = {
  authAndGetRequest,
  authAndPostRequest,
};
