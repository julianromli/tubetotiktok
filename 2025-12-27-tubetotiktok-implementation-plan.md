# Implementation Plan: TubeToTikTok SaaS

I will build the TubeToTikTok application using **Next.js 16 (App Router)**, **Clerk**, **Turso (Drizzle)**, and **OpenRouter (Gemini 3 Flash)**. The application will feature a localized Indonesian AI generator for viral short-form scripts with a hybrid transcript engine for reliability.

## 🛠️ Tech Stack & Dependencies
- **Framework:** Next.js 16 (App Router, Server Actions)
- **Authentication:** Clerk
- **Database:** Turso (libSQL) with Drizzle ORM
- **AI Engine:** Gemini 3 Flash via OpenRouter
- **Transcript Fetching:** `@danielxceron/youtube-transcript` (InnerTube API) + Supadata (Fallback)
- **Rate Limiting:** Upstash Redis
- **UI:** Tailwind CSS + Shadcn UI (Radix UI)
- **Validation:** Zod

## 🏗️ Architecture & Core Components

### 1. Database Schema (`src/db/schema.ts`)
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(), // nanoid
  userId: text('user_id').notNull().index(),
  youtubeUrl: text('youtube_url').notNull(),
  videoTitle: text('video_title'),
  transcriptSource: text('transcript_source'), // 'lib' | 'api_fallback'
  briefs: text('briefs_json', { mode: 'json' }), // Array of script objects
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});
```

### 2. Hybrid Transcript Service (`src/lib/services/transcript.ts`)
- **Primary:** Use `@danielxceron/youtube-transcript` for free extraction.
- **Secondary:** Fallback to **Supadata API** if the primary fails (rate limited or blocked).

### 3. AI Service (`src/lib/services/ai.ts`)
- Uses **OpenRouter** to access **Gemini 3 Flash**.
- **Indonesian Prompting:** Few-shot strategy with Jaksel/Formal style examples.
- **Output:** Structured JSON containing `hook`, `script_body`, `cta`, and `visual_cue`.

### 4. UI Implementation (Matching `code.html`)
- **Theme:** Custom Tailwind colors (Primary: `#f20d55`, Background: `#160b10`).
- **Sidebar:** Navigation and user profile via Clerk.
- **Dashboard:** Masonry grid using `columns-xs` or similar Tailwind utilities.
- **"Try for Free":** Blurred cards for non-authenticated/unlocked results.

## 🚀 Execution Phases

1. **Phase 1: Setup & Infrastructure**
   - Initialize Next.js 16 project.
   - Configure Drizzle with Turso and Clerk for auth.
   - Set up Tailwind theme with colors from `code.html`.

2. **Phase 2: Backend Services**
   - Implement `TranscriptService` with error handling and fallback.
   - Implement `AiService` with specialized Indonesian prompts.
   - Create Server Actions for project generation.

3. **Phase 3: Frontend Development**
   - Port the design from `code.html` to React components.
   - Build the Dashboard, New Project modal, and Results viewer.
   - Implement the "Blur" logic for the free tier.

4. **Phase 4: Rate Limiting & Optimization**
   - Integrate Upstash Redis for IP-based rate limiting.
   - Implement caching using Next.js 16's `use cache` directive to minimize AI costs.

5. **Phase 5: Verification**
   - Run linting, type checks, and manual E2E tests for the transcription flow.
