# App Router & Server Actions

## Identity
Handles application routing, page rendering, and server-side logic via Server Actions.

## Patterns & Conventions

### Server Actions
- **Location**: `src/app/actions/*.ts`
- **Testing**: Colocate tests (e.g., `project.ts` -> `project.test.ts`).
- **Authorization**: ALWAYS check authentication/authorization at the start of an action.
- **Validation**: Use Zod for input validation.
- **Example**:
  ```typescript
  // src/app/actions/project.ts
  'use server'
  import { auth } from '@clerk/nextjs/server';
  import { db } from '@/db';
  
  export async function createProject(data: ProjectData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    // ... logic
  }
  ```

### Pages & Layouts
- **Pages**: `page.tsx` is the route entry point.
- **Layouts**: `layout.tsx` wraps pages.
- **Metadata**: Export `metadata` object for SEO.
- **Error Handling**: Use `error.tsx` for route-level error boundaries.

## JIT Index Hints
- Find all actions: `rg -g "*.ts" "use server" src/app`
- Find middleware usage: `src/middleware.ts`
- Find route params: `rg "params:" src/app`

## Pre-PR Checks
- Run tests for modified actions: `npx vitest src/app/actions/modified-file.test.ts`
