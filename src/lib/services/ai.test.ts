import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateScripts, _clearTestCache } from './ai';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _clearTestCache();
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
  });

  it('should generate scripts correctly when OpenRouter returns valid JSON with "scripts" key', async () => {
    const mockScripts = Array(10).fill(null).map((_, i) => ({
      hook: `Hook ${i + 1}`,
      script_body: `Script body ${i + 1}`,
      cta: `CTA ${i + 1}`,
      visual_cue: `Visual cue ${i + 1}`,
    }));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({ scripts: mockScripts }),
            },
          },
        ],
      }),
    });

    const result = await generateScripts('Test transcript');

    expect(result).toHaveLength(10);
    expect(result).toEqual(mockScripts);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-openrouter-key',
        }),
        body: expect.stringContaining('google/gemini-3-flash-preview'),
      })
    );
  });

  it('should handle response where content is a direct array', async () => {
    const mockScripts = Array(10).fill(null).map((_, i) => ({
      hook: `Hook ${i + 1}`,
      script_body: `Script body ${i + 1}`,
      cta: `CTA ${i + 1}`,
      visual_cue: `Visual cue ${i + 1}`,
    }));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify(mockScripts),
            },
          },
        ],
      }),
    });

    const result = await generateScripts('Test transcript');
    expect(result).toHaveLength(10);
    expect(result).toEqual(mockScripts);
  });

  it('should throw error when OPENROUTER_API_KEY is missing', async () => {
    delete process.env.OPENROUTER_API_KEY;
    await expect(generateScripts('Test transcript')).rejects.toThrow('OPENROUTER_API_KEY is not configured');
  });

  it('should throw error when OpenRouter returns an error status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    });

    await expect(generateScripts('Test transcript')).rejects.toThrow('OpenRouter API error: 401');
  });

  it('should throw error when AI output has wrong number of scripts', async () => {
    const mockScripts = Array(5).fill(null).map((_, i) => ({
      hook: `Hook ${i + 1}`,
      script_body: `Script body ${i + 1}`,
      cta: `CTA ${i + 1}`,
      visual_cue: `Visual cue ${i + 1}`,
    }));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({ scripts: mockScripts }),
            },
          },
        ],
      }),
    });

    await expect(generateScripts('Test transcript')).rejects.toThrow('AI response validation failed');
  });

  it('should throw error when AI output is missing required fields', async () => {
    const mockScripts = Array(10).fill(null).map((_, i) => ({
      hook: `Hook ${i + 1}`,
      // script_body is missing
      cta: `CTA ${i + 1}`,
      visual_cue: `Visual cue ${i + 1}`,
    }));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({ scripts: mockScripts }),
            },
          },
        ],
      }),
    });

    await expect(generateScripts('Test transcript')).rejects.toThrow('AI response validation failed');
  });

  it('should throw error when AI output is not valid JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Not a JSON',
            },
          },
        ],
      }),
    });

    await expect(generateScripts('Test transcript')).rejects.toThrow('AI response validation failed');
  });
});
