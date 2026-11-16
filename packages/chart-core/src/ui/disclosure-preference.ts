/** Explain/Glossary open state a consumer can persist across charts and page loads. */
export interface DisclosurePreference {
  explanationExpanded?: boolean;
  glossaryExpanded?: boolean;
}

const FIELDS = ['explanationExpanded', 'glossaryExpanded'] as const;

/** A non-empty trimmed key, or undefined. */
export function validStorageKey(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

// Accessing localStorage can throw (blocked site data, sandboxed frames), and some runtimes expose a
// placeholder without methods (Node 25 without --localstorage-file), so every use is guarded.
function storage(): Storage | undefined {
  try {
    const store = typeof localStorage === 'undefined' ? undefined : localStorage;
    return store && typeof store.getItem === 'function' && typeof store.setItem === 'function' ? store : undefined;
  } catch { return undefined; }
}

function readRecord(store: Storage, key: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(store.getItem(key) ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch { return {}; }
}

/** Saved booleans only; anything missing, malformed, or unreadable is left out. */
export function readDisclosurePreference(key: string): DisclosurePreference {
  const store = storage();
  if (!store) return {};
  const record = readRecord(store, key);
  const preference: DisclosurePreference = {};
  for (const field of FIELDS) if (typeof record[field] === 'boolean') preference[field] = record[field];
  return preference;
}

/** Merges into the stored record, keeping fields this chart did not change. Failures are ignored. */
export function writeDisclosurePreference(key: string, update: DisclosurePreference): void {
  const store = storage();
  if (!store) return;
  try { store.setItem(key, JSON.stringify({ ...readRecord(store, key), ...update })); } catch { /* full or blocked */ }
}
