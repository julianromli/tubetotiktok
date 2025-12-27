import { aiOutputSchema, type AiOutput } from '../validations/ai-output';

const MODEL_ID = 'google/gemini-3-flash-preview';

const SYSTEM_PROMPT = `
You are an expert Indonesian Content Strategist specializing in viral short-form video scripts (TikTok/Reels/Shorts).
Your goal is to convert video transcripts into exactly 10 distinct, highly engaging scripts.

Tone Guidelines:
- Use natural Indonesian. Use a mix of formal and informal depending on the context.
- Use slang naturally (Bahasa Gaul/Jaksel) when appropriate (e.g., 'Gimana menurut lo?', 'Wajib tau nih', 'Gak sengaja nemu', 'Fix banget').
- Avoid robotic phrases like 'Sebagai kesimpulan', 'Berikut adalah', or generic direct translations.
- Every script must feel like it was written by a human creator, not an AI.

Few-Shot Examples:
1. Style: Jaksel/Informal
   Hook: "Guys, lo harus liat ini. Ternyata cara kita pake skincare selama ini salah total!"
   Script Body: "Jadi gini, gue baru tau kalo pake moisturizer itu mending pas muka masih lembap. Kalo udah kering, penyerapannya gak maksimal. Lo sering nunggu sampe kering dulu gak? Mending mulai sekarang diubah deh."
   CTA: "Tag temen lo yang masih salah pake skincare!"
   Visual Cue: (Close up muka creator yang kaget, transisi ke produk skincare)

2. Style: Semi-Formal/Edukatif
   Hook: "Tahukah Anda? Investasi emas tidak selalu menguntungkan jika dilakukan di waktu yang salah."
   Script Body: "Banyak orang mengira emas adalah instrumen paling aman. Namun, jika kita beli saat harga di puncak tanpa strategi, kita butuh waktu lama untuk break even. Simak cara tentukan waktu beli emas di video ini."
   CTA: "Follow untuk tips finansial lainnya."
   Visual Cue: (Grafik harga emas, teks highlight poin penting)

Output Format:
You MUST return a JSON object with a key "scripts" containing an array of exactly 10 objects. Each script object MUST have these keys:
- hook: A catchy opening line.
- script_body: The main content of the script.
- cta: A clear call to action.
- visual_cue: Brief instructions for visual elements/editing.

Example JSON structure:
{
  "scripts": [
    { "hook": "...", "script_body": "...", "cta": "...", "visual_cue": "..." },
    ...
  ]
}

Response MUST be ONLY the JSON object. Do not include any other text or formatting like markdown code blocks.
`;

const testCache = new Map<string, AiOutput>();

/** @internal */
export function _clearTestCache() {
  testCache.clear();
}

export async function generateScripts(transcript: string): Promise<AiOutput> {
  "use cache";
  
  // In-memory cache for tests since 'use cache' is a no-op in Vitest
  if (process.env.NODE_ENV === 'test' && testCache.has(transcript)) {
    return testCache.get(transcript)!;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  console.log(`[AiService] Requesting script generation for transcript (length: ${transcript.length})`);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://tubetotiktok.com',
      'X-Title': 'TubeToTikTok',
    },
    body: JSON.stringify({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Transcript:\n\n${transcript}` },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from OpenRouter');
  }

  try {
    const parsed = JSON.parse(content);
    const scripts = Array.isArray(parsed) ? parsed : parsed.scripts;
    
    if (!scripts) {
      throw new Error('Response does not contain scripts array');
    }

    const result = aiOutputSchema.parse(scripts);
    
    if (process.env.NODE_ENV === 'test') {
      testCache.set(transcript, result);
    }

    return result;
  } catch (error) {
    console.error('[AiService] Failed to parse AI output:', error);
    if (error instanceof Error) {
      throw new Error(`AI response validation failed: ${error.message}`);
    }
    throw new Error('Failed to generate valid scripts from AI response');
  }
}
