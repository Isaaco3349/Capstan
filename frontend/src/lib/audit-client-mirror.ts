import type { AuditEvent } from "./audit";

const STORAGE_KEY = "capstan-audit-v1";
const MAX_EVENTS = 200;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function readAuditMirror(): AuditEvent[] {
  if (!canUseStorage()) return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAuditMirror(events: AuditEvent[]): void {
  if (!canUseStorage()) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
}

function eventKey(e: AuditEvent): string {
  const orderId = e.meta?.orderId != null ? String(e.meta.orderId) : "";
  const captureId = e.meta?.captureId != null ? String(e.meta.captureId) : "";
  if (orderId && e.type.startsWith("paypal.")) {
    return `${e.type}:${orderId}:${captureId}`;
  }
  if (e.type === "policy.blocked" && e.meta?.amountUsd != null) {
    return `${e.type}:${e.meta.amountUsd}`;
  }
  if (e.type === "agent.draft" && e.meta?.payee != null && e.meta?.amountUsd != null) {
    return `${e.type}:${e.meta.payee}:${e.meta.amountUsd}:${e.at.slice(0, 16)}`;
  }
  if (e.type === "payment.approved" && e.meta?.payee != null && e.meta?.amountUsd != null) {
    return `${e.type}:${e.meta.payee}:${e.meta.amountUsd}`;
  }
  return e.id;
}

export function mergeAuditLists(...lists: AuditEvent[][]): AuditEvent[] {
  const byKey = new Map<string, AuditEvent>();
  for (const list of lists) {
    for (const e of list) {
      const key = eventKey(e);
      const existing = byKey.get(key);
      if (!existing || e.at >= existing.at) {
        byKey.set(key, e);
      }
    }
  }
  return [...byKey.values()].sort((a, b) => b.at.localeCompare(a.at));
}

export function appendAuditMirror(
  event: Omit<AuditEvent, "id" | "at"> & { id?: string; at?: string },
): AuditEvent {
  const entry: AuditEvent = {
    id: event.id ?? `aud_mirror_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    at: event.at ?? new Date().toISOString(),
    type: event.type,
    summary: event.summary,
    meta: event.meta,
  };
  const merged = mergeAuditLists([entry], readAuditMirror());
  saveAuditMirror(merged);
  return entry;
}

export async function fetchAuditForUi(limit = 200): Promise<AuditEvent[]> {
  let apiEvents: AuditEvent[] = [];
  try {
    const res = await fetch(`/api/audit?limit=${limit}`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { events?: AuditEvent[] };
      apiEvents = data.events ?? [];
    }
  } catch {
    // use mirror only
  }

  const merged = mergeAuditLists(apiEvents, readAuditMirror());
  if (merged.length > 0) {
    saveAuditMirror(merged);
  }
  return merged;
}
