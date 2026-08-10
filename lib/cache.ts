// Process-level TTL cache for external API calls.
// Next's unstable_cache doesn't memoize in dev mode, so without this every page
// load re-hits Google/Ahrefs/HubSpot/MCP. Single-instance deployment → a module
// Map is a valid shared cache. Failures are NOT cached (callers handle backoff).
export const CACHE_TTL_MS = 60 * 60 * 1000;

const memCache = new Map<string, { value: unknown; expiresAt: number }>();

export async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = memCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;
  const value = await fn();
  memCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}
