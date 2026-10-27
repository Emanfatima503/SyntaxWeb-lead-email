// Browser-side helpers: first-visit UTM capture + a submit() that attaches it to every payload.

const KEY = 'sw_attribution';
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(location.search);
    const data: Record<string, string> = { referrer: document.referrer, landing_page: location.href };
    for (const k of UTM) data[k] = params.get(k) ?? '';
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage blocked — attribution is best-effort */
  }
}

function getMeta() {
  let stored = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) ?? '{}');
  } catch {}
  return { ...stored, source_page: location.pathname };
}

export async function submit<T = Record<string, unknown>>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, meta: getMeta() }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.error ?? 'Something went wrong. Please try again.');
  return (json.data ?? {}) as T;
}
