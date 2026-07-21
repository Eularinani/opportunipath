type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyPrefix?: string;
}

export function rateLimit(
  key: string,
  { windowMs = 60_000, maxRequests = 5, keyPrefix = '' }: RateLimitOptions = {}
): { success: boolean; resetAt: number; remaining: number } {
  const now = Date.now();
  const fullKey = keyPrefix ? `${keyPrefix}:${key}` : key;
  const entry = store.get(fullKey);

  if (!entry || now > entry.resetAt) {
    store.set(fullKey, { count: 1, resetAt: now + windowMs });
    return { success: true, resetAt: now + windowMs, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { success: false, resetAt: entry.resetAt, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, resetAt: entry.resetAt, remaining: maxRequests - entry.count };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}
