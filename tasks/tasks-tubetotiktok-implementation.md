## Relevant Files

- `src/db/schema.ts` - Database schema definition for projects and briefs.
- `src/lib/services/transcript.ts` - Hybrid transcript fetching logic (InnerTube + Supadata fallback).
- `src/lib/services/ai.ts` - Gemini 3 Flash integration via OpenRouter with Indonesian prompts.
- `src/app/dashboard/page.tsx` - Main dashboard featuring the masonry grid of script cards.
- `src/app/actions/project.ts` - Server actions for transcript fetching and AI generation.
- `src/components/dashboard/BriefCard.tsx` - Individual script card component with copy functionality.
- `src/lib/rate-limit.ts` - Upstash Redis logic for IP and fingerprint-based rate limiting.
- `src/middleware.ts` - Global middleware for auth (Clerk) and rate limit enforcement.
- `src/lib/utils/fingerprint.ts` - Client-side utility for FingerprintJS integration.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npm test` or `npx jest [optional/path/to/test/file]` to run tests.
- Ensure environment variables for Clerk, Turso, OpenRouter, and Upstash are configured in `.env.local`.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/tubetotiktok-mvp`)
- [ ] 1.0 Project Initialization & Infrastructure Setup
  - [ ] 1.1 Initialize Next.js 16 project with App Router and Tailwind CSS.
  - [ ] 1.2 Integrate Clerk for authentication and user management.
  - [ ] 1.3 Configure Drizzle ORM with Turso (libSQL) connection.
  - [ ] 1.4 Set up Upstash Redis client for rate limiting functionality.
- [ ] 2.0 Core Backend Services Implementation
  - [ ] 2.1 Build `TranscriptService` with `@danielxceron/youtube-transcript` and Supadata fallback.
  - [ ] 2.2 Build `AiService` using OpenRouter for Gemini 3 Flash with specialized Indonesian few-shot prompts.
  - [ ] 2.3 Implement Zod validation for YouTube URLs and AI generated JSON outputs.
- [ ] 3.0 Database & State Management
  - [ ] 3.1 Define `projects` table in `schema.ts` according to the PRD.
  - [ ] 3.2 Push schema changes to Turso database.
  - [ ] 3.3 Create Server Actions for project creation and script retrieval.
- [ ] 4.0 UI/UX Implementation (Dashboard & Components)
  - [ ] 4.1 Convert `code.html` design into React components using Tailwind and Shadcn UI.
  - [ ] 4.2 Build the masonry grid layout for the dashboard results.
  - [ ] 4.3 Implement "Copy to Clipboard" with formatting preservation for scripts.
  - [ ] 4.4 Add the visual blur effect logic for free-tier results.
- [ ] 5.0 Rate Limiting, Optimization & Verification
  - [ ] 5.1 Implement IP and digital fingerprint (FingerprintJS) rate limiting in middleware.
  - [ ] 5.2 Optimize AI costs by caching results based on YouTube URL using `use cache`.
  - [ ] 5.3 Run linting, type checks, and verify core flows (transcription -> generation -> display).
