import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import middleware from "./middleware";
import { ratelimit } from "@/lib/ratelimit";
import type { Mock } from "vitest";

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: (handler: (auth: unknown, req: NextRequest) => Promise<NextResponse | void>) => handler,
  createRouteMatcher: () => vi.fn().mockReturnValue(false),
}));

// Mock ratelimit
vi.mock("@/lib/ratelimit", () => ({
  ratelimit: {
    limit: vi.fn(),
  },
}));

describe("Middleware Rate Limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow request if rate limit is not exceeded", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
    });

    const req = new NextRequest("http://localhost:3000/api/projects", {
      method: "GET",
    });
    
    // @ts-expect-error - Mocking auth
    const result = await middleware({} as any, req);
    
    expect(ratelimit.limit).toHaveBeenCalled();
    expect(result).toBeUndefined(); // middleware continues
  });

  it("should block request if rate limit is exceeded", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 3600000,
    });

    const req = new NextRequest("http://localhost:3000/api/projects", {
      method: "GET",
    });
    
    // @ts-expect-error - Mocking auth
    const result = await middleware({} as any, req);
    
    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(429);
    expect(result?.headers.get("X-RateLimit-Limit")).toBe("10");
  });

  it("should use fingerprint from cookie if header is missing", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
    });

    const req = new NextRequest("http://localhost:3000/api/projects", {
      method: "GET",
      headers: {
        cookie: "x-fingerprint=test-fingerprint",
      },
    });
    
    // @ts-expect-error - Mocking auth
    await middleware({} as any, req);
    
    expect(ratelimit.limit).toHaveBeenCalledWith(expect.stringContaining("test-fingerprint"));
  });

  it("should rate limit POST requests to dashboard (Server Actions)", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
    });

    const req = new NextRequest("http://localhost:3000/dashboard", {
      method: "POST",
    });
    
    // @ts-expect-error - Mocking auth
    await middleware({} as any, req);
    
    expect(ratelimit.limit).toHaveBeenCalled();
  });
});
