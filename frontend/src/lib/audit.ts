import { readAuditEvents, writeAuditEvents } from "./audit-store";

export type AuditEvent = {
  id: string;
  at: string;
  type:
    | "agent.draft"
    | "payment.draft"
    | "policy.blocked"
    | "payment.approved"
    | "paypal.order_created"
    | "paypal.captured"
    | "paypal.error";
  summary: string;
  meta?: Record<string, string | number | boolean | undefined>;
};

const MAX_EVENTS = 200;

function id(): string {
  return `aud_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function appendAudit(
  event: Omit<AuditEvent, "id" | "at"> & { at?: string },
): Promise<AuditEvent> {
  const entry: AuditEvent = {
    id: id(),
    at: event.at ?? new Date().toISOString(),
    type: event.type,
    summary: event.summary,
    meta: event.meta,
  };

  const events = await readAuditEvents();
  events.unshift(entry);
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
  await writeAuditEvents(events);
  return entry;
}

export async function listAudit(limit = 50): Promise<AuditEvent[]> {
  const events = await readAuditEvents();
  return events.slice(0, limit);
}
