const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
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
  }
};

module.exports = {
  redisClient,
  connectRedis,
};