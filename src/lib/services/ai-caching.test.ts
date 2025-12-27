import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateScripts, _clearTestCache } from './ai';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AiService Caching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _clearTestCache();
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
  });

  it('should only call the underlying fetch once for the same transcript', async () => {
    const transcript = "Same transcript";
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

    // Call twice
    await generateScripts(transcript);
    await generateScripts(transcript);

    // This is expected to FAIL in vitest because 'use cache' is not active
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
