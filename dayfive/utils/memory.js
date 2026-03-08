import redisClient from "./redis.js";

export async function getMemory(userId) {
  try {
    const data = await redisClient.get(`conversation:${userId}`);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.log("Redis error:", err);
    return [];
  }
}

export async function setMemory(userId, messages) {
try {
    await redisClient.set(
      `conversation:${userId}`,
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Redis setMemory error:", error);
  }}
