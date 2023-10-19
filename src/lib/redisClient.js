const { createClient } = require('redis');
const { REDIS_HOST, REDIS_PORT } = process.env; 
const REDIS_HOST_URL = `${REDIS_HOST}:${REDIS_PORT}`;

let client = null;

(async () => {
  if (!client) {
    client = createClient({ 
      url: `redis://${REDIS_HOST_URL}` ,
    });
    await client.connect();
  }
})();

module.exports = client;
