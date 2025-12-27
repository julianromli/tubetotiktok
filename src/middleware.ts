import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/projects(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Apply rate limiting to API routes and project creation actions
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/projects");
  const isProjectAction = req.method === "POST" && (
    req.nextUrl.pathname.startsWith("/dashboard") || 
    req.nextUrl.pathname === "/"
  );

  if (isApiRoute || isProjectAction) {
    const ip = (req as any).ip ?? "127.0.0.1";
    const fingerprint = req.headers.get("x-fingerprint") ?? 
                       req.cookies.get("x-fingerprint")?.value ?? 
                       "unknown";
    
    // Use a composite key for rate limiting: IP + Fingerprint
    // This makes it harder to bypass by just changing IP or just changing fingerprint
    const identifier = `rl:${ip}:${fingerprint}`;
    
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

    if (!success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
