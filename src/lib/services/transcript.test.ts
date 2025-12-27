import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTranscript } from './transcript';
import { YoutubeTranscript } from '@danielxceron/youtube-transcript';

// Mock the youtube-transcript library
vi.mock('@danielxceron/youtube-transcript', () => ({
  YoutubeTranscript: {
    fetchTranscript: vi.fn(),
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TranscriptService', () => {
  const mockUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const mockVideoId = 'dQw4w9WgXcQ';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SUPADATA_API_KEY = 'test-api-key';
  });

  it('should return transcript from primary engine (youtube-transcript)', async () => {
    const mockTranscript = [
      { text: 'Hello', offset: 0, duration: 1 },
      { text: 'World', offset: 1, duration: 1 },
    ];
    (YoutubeTranscript.fetchTranscript as any).mockResolvedValue(mockTranscript);

    const result = await getTranscript(mockUrl);

    expect(result).toEqual({
      transcript: 'Hello World',
      source: 'lib',
      videoId: mockVideoId,
    });
    expect(YoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(mockVideoId);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should fallback to Supadata if primary engine fails', async () => {
    // Primary fails
    (YoutubeTranscript.fetchTranscript as any).mockRejectedValue(new Error('Blocked by YouTube'));
    
    // Supadata succeeds
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ content: 'Transcript from Supadata' }),
    });

    const result = await getTranscript(mockUrl);

    expect(result).toEqual({
      transcript: 'Transcript from Supadata',
      source: 'api_fallback',
      videoId: mockVideoId,
    });
    expect(YoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(mockVideoId);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('supadata.ai'),
      expect.objectContaining({
        headers: { 'x-api-key': 'test-api-key' },
      })
    );
  });

  it('should throw error if both engines fail', async () => {
    // Primary fails
    (YoutubeTranscript.fetchTranscript as any).mockRejectedValue(new Error('Blocked by YouTube'));
    
    // Supadata fails
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    });

    await expect(getTranscript(mockUrl)).rejects.toThrow('Failed to fetch transcript from all sources');
  });

  it('should throw error if Supadata API key is missing and primary fails', async () => {
    delete process.env.SUPADATA_API_KEY;
    (YoutubeTranscript.fetchTranscript as any).mockRejectedValue(new Error('Blocked by YouTube'));

    await expect(getTranscript(mockUrl)).rejects.toThrow('Supadata API key is not configured');
  });

  it('should throw error for invalid YouTube URL', async () => {
    await expect(getTranscript('https://google.com')).rejects.toThrow('Invalid YouTube URL');
  });
});
