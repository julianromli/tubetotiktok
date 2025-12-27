import { YoutubeTranscript } from '@danielxceron/youtube-transcript';
import { extractYoutubeId } from '../validations/youtube';

export interface TranscriptData {
  transcript: string;
  source: 'lib' | 'api_fallback';
  videoId: string;
  title: string;
}

async function getVideoTitle(url: string): Promise<string> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (!response.ok) return "Untitled Video";
    const data = await response.json();
    return data.title || "Untitled Video";
  } catch {
    return "Untitled Video";
  }
}

export async function getTranscript(url: string): Promise<TranscriptData> {
  "use cache";
  const videoId = extractYoutubeId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const title = await getVideoTitle(url);

  try {
    // Primary: youtube-transcript (InnerTube API / Scraping)
    console.log(`[TranscriptService] Attempting primary fetch for ${videoId}`);
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptItems || transcriptItems.length === 0) {
      throw new Error('Empty transcript from primary source');
    }

    return {
      transcript: transcriptItems.map((item) => item.text).join(' '),
      source: 'lib',
      videoId,
      title,
    };
  } catch (error) {
    console.warn(`[TranscriptService] Primary fetch failed for ${videoId}:`, error instanceof Error ? error.message : error);
    
    // Fallback: Supadata API
    const fallbackData = await fetchSupadataTranscript(url, videoId);
    return { ...fallbackData, title };
  }
}

async function fetchSupadataTranscript(url: string, videoId: string): Promise<Omit<TranscriptData, 'title'>> {
  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) {
    throw new Error('Supadata API key is not configured and primary fetch failed');
  }

  console.log(`[TranscriptService] Attempting fallback fetch for ${videoId} via Supadata`);

  try {
    const response = await fetch(`https://api.supadata.ai/v1/youtube/transcript?url=${encodeURIComponent(url)}&text=true`, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Supadata API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Based on docs, if text=true, it might return { content: "..." } or similar
    // We'll check for 'content' or 'transcript' in the response
    const transcript = data.content || data.transcript || (typeof data === 'string' ? data : null);

    if (!transcript) {
      throw new Error('Invalid response format from Supadata');
    }

    return {
      transcript,
      source: 'api_fallback',
      videoId,
    };
  } catch (error) {
    console.error(`[TranscriptService] Fallback fetch failed for ${videoId}:`, error instanceof Error ? error.message : error);
    throw new Error(`Failed to fetch transcript from all sources. Last error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
