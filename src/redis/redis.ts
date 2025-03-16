import { Redis } from "@upstash/redis";

const expiresIn = 60 * 60 * 24 * 7; // 7 days

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function getSession<T extends { id: string }>({
  sessionId,
  type,
}: {
  sessionId: string;
  type: "session" | "user";
}): Promise<T | null> {
  const value = await redis.get(`${type}:${sessionId}`);

  if (!value) return null;

  return value as T;
}

async function setSession<T extends { id: string }>({
  valueToStore,
  sessionId,
  type = "session",
}: {
  valueToStore: T;
  sessionId: string;
  type?: "session" | "user";
}) {
  const session = await getSession<{ id: string }>({ sessionId, type });

  if (session) {
    console.log({ session: `session:${session.id}` });
    await redis.del(`session:${session.id}`);
  }

  return await redis.set(`${type}:${sessionId}`, JSON.stringify(valueToStore), {
    ex: expiresIn,
  });
}

export const redisObj = {
  setUserSession: setSession,
  getUserSession: getSession,
};
