import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(), // nanoid
  userId: text('user_id').notNull(),
  youtubeUrl: text('youtube_url').notNull(),
  videoTitle: text('video_title'),
  transcriptSource: text('transcript_source'), // 'lib' | 'api_fallback'
  briefs: text('briefs_json', { mode: 'json' }), // Array of script objects
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}));
