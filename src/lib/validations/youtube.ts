import { z } from 'zod';

export const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})/;

export const youtubeUrlSchema = z.object({
  url: z.string().regex(youtubeUrlRegex, 'Invalid YouTube URL'),
});

export type YoutubeUrlInput = z.infer<typeof youtubeUrlSchema>;

export function extractYoutubeId(url: string): string | null {
  const match = url.match(youtubeUrlRegex);
  return match ? match[5] : null;
}
