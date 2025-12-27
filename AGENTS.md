# Project Context & Guidelines

## Project Snapshot
- **Type**: Single Next.js 16 Application (App Router)
- **Stack**: TypeScript, Tailwind 4, Clerk (Auth), Drizzle/Turso (DB), Redis (Cache)
- **Testing**: Vitest (Unit/Integration)
- **Key Principle**: Use "Just-In-Time" documentation - read the local `AGENTS.md` in subfolders.

## Root Commands
- **Install**: `npm install`
- **Dev**: `npm run dev` (starts on port 3000)
- **Test**: `npm test` (Vitest watch mode)
- **Lint**: `npm run lint`

## Universal Conventions
- **Style**: Strict TypeScript. Functional components only.
- **Styling**: Tailwind CSS v4. No CSS modules unless absolutely necessary.
- **Async**: Prefer `async/await`. Handle errors with `try/catch`.
- **Imports**: Use `@/` for absolute imports (e.g., `import { db } from '@/db'`).

## JIT Index (Directory Map)
*Open these files for specific guidance:*

### Core Application
- **Routing & Actions**: `src/app/` → [see src/app/AGENTS.md](src/app/AGENTS.md)
- **UI Components**: `src/components/` → [see src/components/AGENTS.md](src/components/AGENTS.md)
- **Database & Schema**: `src/db/` → [see src/db/AGENTS.md](src/db/AGENTS.md)
- **Utils & Services**: `src/lib/` → [see src/lib/AGENTS.md](src/lib/AGENTS.md)

### Quick Search Commands
- Find actions: `rg "export async function" src/app/actions`
- Find DB schema: `rg "export const .* = sqliteTable" src/db`
- Find components: `rg "export function [A-Z]" src/components`

## Definition of Done
1.  **Code**: Strict types, no `any`.
2.  **Tests**: Unit tests pass (`npm test`).
3.  **Lint**: No eslint warnings.
4.  **Security**: No hardcoded secrets. Use `process.env`.
