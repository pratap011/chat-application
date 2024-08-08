// utils/redisClient.js
const { createClient } = require('redis');

const REDIS_URI=process.env.REDIS_URI;
// Configuration for Redis connection
const redisConfig = {
  url:'redis://redis:6379'
  // Change this to your Redis server URL and port
  // Add any other necessary configuration options here
};

const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = redisClient;
