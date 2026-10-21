"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";

type AuditEvent = {
  id: string;
  at: string;
  type: string;
  summary: string;
};

function toneForType(type: string): "neutral" | "accent" | "success" | "warning" | "error" {
  if (type.includes("blocked") || type.includes("error")) return "error";
  if (type.includes("captured")) return "success";
  if (type.includes("agent")) return "accent";
  if (type.includes("paypal")) return "accent";
  if (type.includes("approved")) return "warning";
  return "neutral";
}

function labelForType(type: string): string {
  return type.replace(/\./g, " ");
}

export function AuditFeed({ refreshKey }: { refreshKey: number }) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/audit");
    if (res.ok) {
      const data = (await res.json()) as { events: AuditEvent[] };
      setEvents(data.events);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  return (
    <Card className="sticky top-24 h-fit lg:top-28" padding="md">
      <CardHeader
        title="Audit trail"
        description="Running log of policy decisions and PayPal API actions for this session."
      />
      <div className="relative">
        {loading && events.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">Loading…</p>
        ) : events.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-bg/50 px-4 py-10 text-center">
            <p className="text-sm font-medium text-text">No events yet</p>
            <p className="mt-1 text-xs text-text-muted">
              Draft a payment or trigger a policy block to populate the log.
            </p>
          </div>
        ) : (
          <ul className="max-h-[min(28rem,60vh)] space-y-0 overflow-y-auto pr-1">
            {events.map((e, i) => (
              <li key={e.id} className="relative flex gap-3 pb-6 last:pb-0">
                {i < events.length - 1 ? (
                  <span
                    className="absolute left-[5px] top-3 h-[calc(100%-4px)] w-px bg-border"
                    aria-hidden
                  />
                ) : null}
                <span
                  className="relative z-[1] mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-surface bg-accent"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={toneForType(e.type)}>
                      {labelForType(e.type)}
                    </Badge>
                    <time
                      className="font-mono text-[11px] text-text-faint"
                      dateTime={e.at}
                    >
                      {new Date(e.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-text">
                    {e.summary}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
