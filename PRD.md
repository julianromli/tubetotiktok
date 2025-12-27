# Product Requirements Document (PRD)

| **Project Name** | TubeToTikTok (Refined) |
| :--- | :--- |
| **Status** | Ready for Development |
| **Last Updated** | December 27, 2025 |
| **Version** | 1.1 (Refined for Production) |

## 1. One Pager

### Overview
TubeToTikTok is a localized SaaS for the Indonesian market that converts long-form YouTube videos into 10 distinct, viral-ready TikTok/Reels scripts. It uses **Gemini 3 Flash** for high-speed, low-cost context processing, solving the "writer's block" problem for creators and UMKMs.

### Problem & Solution
*   **Problem:** Manual summarization is slow; generic AI tools sound robotic and fail at Indonesian slang (*bahasa gaul*).
*   **Solution:** An AI wrapper specifically tuned for Indonesian nuances, with a friction-free "Try for Free" model.

## 2. Functional Requirements (MVP)

### Core Features
1.  **Public "Try for Free" (Abuse-Resistant)**
    *   **Input:** YouTube URL.
    *   **Constraint:** 1 free generation per digital fingerprint (using FingerprintJS or similar) + IP rate limit.
    *   **Output:** 1 unlocked brief, 9 blurred.
2.  **Hybrid Transcript Engine (Critical Upgrade)**
    *   **Primary Method:** `youtube-transcript` library (Free, runs on edge/server).
    *   **Fallback Method:** If Primary fails (429/Blocked), auto-switch to **Supadata** or **SerpApi** (Paid, high reliability).
    *   *Reasoning: Server-side scrapers often get blocked by YouTube. A fallback is mandatory for SaaS reliability.*
3.  **Localized AI Generation**
    *   **Model:** Gemini 3 Flash (via OpenRouter).
    *   **Prompt Strategy:** Use "Few-Shot Prompting" with examples of "Jaksel" vs. "Formal" styles.
    *   **Output:** JSON with `hook`, `script_body`, `cta`, and `visual_cue`.
4.  **Dashboard**
    *   **View:** Masonry grid of 10 cards.
    *   **Action:** "Copy with Formatting" (preserves bolding/emojis for pasting into Notion/TikTok caption).

## 3. Technical Architecture

### Stack (Dec 2025 Standard)
| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Latest standard. React 19 support, improved Server Actions. |
| **Auth** | **Clerk** | Best-in-class auth for Next.js. |
| **Database** | **Turso (libSQL)** | Serverless SQLite, negligible latency for read-heavy dashboards. |
| **ORM** | **Drizzle ORM** | Lightweight, type-safe, perfect match for Turso. |
| **AI Provider** | **OpenRouter** | Aggregator allowing instant switching between Gemini versions if needed. |
| **Rate Limiting** | **Upstash Redis** | Essential for the "Try for Free" limit (low latency counters). |
| **Validation** | **Zod** | Runtime schema validation for API inputs/outputs. |

### Data Schema (Updated)
```typescript
// Users table managed by Clerk

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().index(),
  youtubeUrl: text('youtube_url').notNull(),
  videoTitle: text('video_title'),
  transcriptSource: text('transcript_source'), // 'lib' or 'api_fallback'
  briefs: text('briefs_json', { mode: 'json' }), // Stored as JSON
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});
```

## 4. AI Prompting Strategy (Indonesian Context)

**System Instruction:**
> "You are an expert Indonesian Content Strategist. Your goal is to convert transcripts into viral short-form scripts.
>
> **Tone Guidelines:**
> - Use natural Indonesian (mix of formal/informal depending on context).
> - Use slang naturally (e.g., 'Gimana menurut lo?', 'Wajib tau nih').
> - Avoid robotic phrases like 'Sebagai kesimpulan' or generic translations."

## 5. Risk Mitigation

1.  **YouTube Blocking:** Implement the hybrid transcript fetcher immediately. Monitor failure rates via logs.
2.  **Token Costs:** Gemini 3 Flash is cheap, but cache results. If a user re-submits the same URL, fetch from DB instead of re-generating.
3.  **Abuse:** Use Upstash Redis to track IP usages. Block VPNs if possible (optional for MVP).

## 6. Development Phases

*   **Phase 1 (Setup):** Repo init, Clerk + Turso + Drizzle setup.
*   **Phase 2 (Core Logic):** Build `TranscriptService` (with fallback) and `AiService`. Test heavily with diverse video types.
*   **Phase 3 (UI/UX):** Next.js App Router pages, Shadcn UI implementation, "Blur" effect logic.
*   **Phase 4 (Refine):** Prompt engineering loop (Generate -> Review -> Tweak Prompt).
*   **Phase 5 (Launch):** Deployment to Vercel.
