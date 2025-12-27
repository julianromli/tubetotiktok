import { z } from 'zod';

export const aiScriptSchema = z.object({
  hook: z.string().min(1),
  script_body: z.string().min(1),
  cta: z.string().min(1),
  visual_cue: z.string().min(1),
});

export const aiOutputSchema = z.array(aiScriptSchema).length(10);

export type AiScript = z.infer<typeof aiScriptSchema>;
export type AiOutput = z.infer<typeof aiOutputSchema>;
