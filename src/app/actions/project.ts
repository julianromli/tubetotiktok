"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getTranscript } from "@/lib/services/transcript";
import { generateScripts } from "@/lib/services/ai";
import { youtubeUrlSchema } from "@/lib/validations/youtube";
import { ratelimit, freeRatelimit } from "@/lib/ratelimit";
import { nanoid } from "nanoid";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers, cookies } from "next/headers";

export async function tryForFreeAction(url: string) {
  // 1. Get Fingerprint and IP
  const cookieStore = await cookies();
  const fingerprint = cookieStore.get("x-fingerprint")?.value;
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") || "unknown";

  if (!fingerprint) {
    throw new Error("Missing fingerprint. Please enable cookies.");
  }

  // 2. Validation
  const validated = youtubeUrlSchema.safeParse({ url });
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  // 3. Rate Limit (Fingerprint + IP)
  const identifier = `${fingerprint}:${ip}`;
  const { success } = await freeRatelimit.limit(identifier);
  if (!success) {
    throw new Error("Free limit reached (1 per 24h). Sign up to unlock unlimited!");
  }

  // 4. Get Transcript
  const transcriptData = await getTranscript(url);

  // 5. Generate Scripts
  const scripts = await generateScripts(transcriptData.transcript);

  // 6. Return data (do not save to DB yet to keep it simple and avoid schema issues)
  return { 
    videoId: transcriptData.videoId,
    scripts 
  };
}

export async function createProjectAction(url: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1. Validation
  const validated = youtubeUrlSchema.safeParse({ url });
  if (!validated.success) {
    throw new Error(validated.error.issues[0].message);
  }

  // 2. Rate Limit
  const { success } = await ratelimit.limit(userId);
  if (!success) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  // 3. Get Transcript
  const transcriptData = await getTranscript(url);

  // 4. Generate Scripts
  const scripts = await generateScripts(transcriptData.transcript);

  // 5. Save to DB
  const projectId = nanoid();
  await db.insert(projects).values({
    id: projectId,
    userId,
    youtubeUrl: url,
    videoTitle: `Video ${transcriptData.videoId}`,
    transcriptSource: transcriptData.source,
    briefs: scripts,
  });

  revalidatePath("/dashboard");
  return { id: projectId };
}

export async function getProjectsAction() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    orderBy: [desc(projects.createdAt)],
  });
}

export async function getProjectAction(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.userId, userId)),
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}
