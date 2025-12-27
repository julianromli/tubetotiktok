import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProjectAction, getProjectsAction, getProjectAction } from './project';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { getTranscript } from '@/lib/services/transcript';
import { generateScripts } from '@/lib/services/ai';
import { ratelimit } from '@/lib/ratelimit';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue({}),
    })),
    query: {
      projects: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  },
}));

vi.mock('@/lib/services/transcript', () => ({
  getTranscript: vi.fn(),
}));

vi.mock('@/lib/services/ai', () => ({
  generateScripts: vi.fn(),
}));

vi.mock('@/lib/ratelimit', () => ({
  ratelimit: {
    limit: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('nanoid', () => ({
  nanoid: vi.fn(),
}));

describe('Project Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProjectAction', () => {
    it('should create a project successfully', async () => {
      const mockUserId = 'user_123';
      const mockUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const mockTranscript = { transcript: 'hello', source: 'lib', videoId: 'dQw4w9WgXcQ' };
      const mockScripts = [{ hook: 'hook', script_body: 'body', cta: 'cta', visual_cue: 'cue' }];
      const mockProjectId = 'project_123';

      (auth as any).mockResolvedValue({ userId: mockUserId });
      (ratelimit.limit as any).mockResolvedValue({ success: true });
      (getTranscript as any).mockResolvedValue(mockTranscript);
      (generateScripts as any).mockResolvedValue(mockScripts);
      (nanoid as any).mockReturnValue(mockProjectId);

      const result = await createProjectAction(mockUrl);

      expect(result).toEqual({ id: mockProjectId });
      expect(db.insert).toHaveBeenCalledWith(projects);
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    });

    it('should throw error if unauthorized', async () => {
      (auth as any).mockResolvedValue({ userId: null });
      await expect(createProjectAction('url')).rejects.toThrow('Unauthorized');
    });

    it('should throw error if invalid youtube url', async () => {
      (auth as any).mockResolvedValue({ userId: 'user_123' });
      await expect(createProjectAction('invalid-url')).rejects.toThrow('Invalid YouTube URL');
    });

    it('should throw error if rate limited', async () => {
      (auth as any).mockResolvedValue({ userId: 'user_123' });
      (ratelimit.limit as any).mockResolvedValue({ success: false });
      await expect(createProjectAction('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('getProjectsAction', () => {
    it('should return projects for current user', async () => {
      const mockUserId = 'user_123';
      const mockProjects = [{ id: '1', userId: mockUserId }];

      (auth as any).mockResolvedValue({ userId: mockUserId });
      (db.query.projects.findMany as any).mockResolvedValue(mockProjects);

      const result = await getProjectsAction();

      expect(result).toEqual(mockProjects);
      expect(db.query.projects.findMany).toHaveBeenCalled();
    });
  });

  describe('getProjectAction', () => {
    it('should return a project by id', async () => {
      const mockUserId = 'user_123';
      const mockProject = { id: '1', userId: mockUserId };

      (auth as any).mockResolvedValue({ userId: mockUserId });
      (db.query.projects.findFirst as any).mockResolvedValue(mockProject);

      const result = await getProjectAction('1');

      expect(result).toEqual(mockProject);
    });

    it('should throw error if project not found', async () => {
      (auth as any).mockResolvedValue({ userId: 'user_123' });
      (db.query.projects.findFirst as any).mockResolvedValue(null);

      await expect(getProjectAction('1')).rejects.toThrow('Project not found');
    });
  });
});
