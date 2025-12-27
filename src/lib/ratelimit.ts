import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Create a new ratelimiter, that allows 10 requests per 1 hour
// This matches the PRD requirement for logged-in users
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "tubetotiktok-ratelimit",
});

// Create a stricter ratelimiter for free/anonymous users
// 1 request per 24 hours per fingerprint/IP
export const freeRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "24 h"),
  analytics: true,
  prefix: "tubetotiktok-free-ratelimit",
});
