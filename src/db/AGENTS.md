# Database (Drizzle + Turso)

## Identity
Data access layer using Drizzle ORM connected to LibSQL (Turso).

## Setup & Run
- **Generate Migrations**: `npx drizzle-kit generate`
- **Push Schema**: `npx drizzle-kit push` (or migrate manually)
- **Studio**: `npx drizzle-kit studio`

## Patterns & Conventions

### Schema Definition
- **Location**: `src/db/schema.ts`
- **Types**: Infer types from schema using `typeof schema.table.$inferSelect`.
- **Example**:
  ```typescript
  // src/db/schema.ts
  import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
  
  export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
  });
  ```

### Database Access
- **Instance**: Import singleton from `@/db` (defined in `src/db/index.ts`).
- **Queries**: Use Drizzle query builder.
  ```typescript
  import { db } from '@/db';
  import { users } from '@/db/schema';
  import { eq } from 'drizzle-orm';
  
  const user = await db.select().from(users).where(eq(users.id, userId));
  ```

## Common Gotchas
- **Environment**: Ensure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set in `.env.local`.
- **Migrations**: Always generate migrations after changing `schema.ts`.
