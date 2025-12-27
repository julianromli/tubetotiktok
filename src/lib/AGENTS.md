# Utilities & Services

## Identity
Shared logic, external service integrations, and helper functions.

## Patterns & Conventions

### Utilities
- **Location**: `src/lib/utils/**`
- **Purpose**: Pure functions, formatting, validation helpers.
- **Ratelimit**: Use `src/lib/ratelimit.ts` for Upstash Ratelimit.
- **Redis**: Use `src/lib/redis.ts` for Upstash Redis client.

### Services
- **Location**: `src/lib/services/**`
- **Purpose**: Business logic that doesn't fit in UI or simple Utils (e.g., complex API integrations).

## Key Files
- **Redis**: `src/lib/redis.ts`
- **Rate Limit**: `src/lib/ratelimit.ts`
- **Utils**: `src/lib/utils/index.ts` (often where `cn` lives)

## Pre-PR Checks
- Ensure any new utility has a corresponding unit test in `src/lib/**/*.test.ts`.
