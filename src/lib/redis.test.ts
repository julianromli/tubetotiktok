import { describe, it, expect, vi } from 'vitest';

vi.hoisted(() => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token';
});

// Mock @upstash/redis
vi.mock('@upstash/redis', () => {
  return {
    Redis: vi.fn().mockImplementation(function () {
      return {
        get: vi.fn(),
        set: vi.fn(),
      };
    }),
  };
});

import { redis } from './redis';
import { Redis } from '@upstash/redis';

describe('Redis client', () => {
  it('should be initialized with the correct configuration', () => {
    expect(Redis).toHaveBeenCalledWith({
      url: 'https://example.com',
      token: 'fake-token',
    });
    expect(redis).toBeDefined();
  });
});
