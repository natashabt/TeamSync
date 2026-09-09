const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("REDIS_URL is not defined!");
}

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error.message);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();

    console.log("Redis connected successfully!");
  } catch (error) {
    console.error(
      "Redis connection failed:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  redisClient,
  connectRedis,
};