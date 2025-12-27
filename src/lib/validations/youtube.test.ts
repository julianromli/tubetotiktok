import { describe, it, expect } from 'vitest';
import { extractYoutubeId, youtubeUrlSchema } from './youtube';

describe('YouTube Validations', () => {
  describe('extractYoutubeId', () => {
    it('should extract ID from standard URL', () => {
      expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from short URL', () => {
      expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from embed URL', () => {
      expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URL', () => {
      expect(extractYoutubeId('https://google.com')).toBe(null);
    });
  });

  describe('youtubeUrlSchema', () => {
    it('should validate correct URLs', () => {
      expect(youtubeUrlSchema.safeParse({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }).success).toBe(true);
      expect(youtubeUrlSchema.safeParse({ url: 'https://youtu.be/dQw4w9WgXcQ' }).success).toBe(true);
    });

    it('should reject incorrect URLs', () => {
      expect(youtubeUrlSchema.safeParse({ url: 'https://google.com' }).success).toBe(false);
      expect(youtubeUrlSchema.safeParse({ url: 'not-a-url' }).success).toBe(false);
    });
  });
});
