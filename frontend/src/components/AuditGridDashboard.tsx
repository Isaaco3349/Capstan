"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColDef, GridApi, RowSelectedEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button } from "./ui/Button";
import { Card, CardHeader } from "./ui/Card";
import { EventTypeCell } from "./grid/EventTypeCell";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type RawEvent = {
  id: string;
  at: string;
  type: string;
  summary: string;
  meta?: Record<string, string | number | boolean | undefined>;
};

type AuditRow = {
  id: string;
  at: string;
  time: string;
  rawType: string;
  type: string;
  summary: string;
  amountUsd: string;
  payee: string;
  orderId: string;
  captureId: string;
};

type ViewPreset = "all" | "captures" | "policy" | "agent";

function toRows(events: RawEvent[]): AuditRow[] {
  const amountByOrder = new Map<string, string>();
  for (const e of events) {
    const orderId = e.meta?.orderId != null ? String(e.meta.orderId) : "";
    if (orderId && e.meta?.amountUsd != null) {
      amountByOrder.set(orderId, String(e.meta.amountUsd));
    }
  }

  return events.map((e) => {
    const orderId = e.meta?.orderId != null ? String(e.meta.orderId) : "";
    let amountUsd =
      e.meta?.amountUsd != null ? String(e.meta.amountUsd) : "";
    if (!amountUsd && orderId && e.type === "paypal.captured") {
      amountUsd = amountByOrder.get(orderId) ?? "";
    }
    return {
      id: e.id,
      at: e.at,
      time: new Date(e.at).toLocaleString(),
      rawType: e.type,
      type: e.type.replace(/\./g, " "),
      summary: e.summary,
      amountUsd,
      payee: e.meta?.payee != null ? String(e.meta.payee) : "",
      orderId,
      captureId: e.meta?.captureId != null ? String(e.meta.captureId) : "",
    };
  });
}

function formatMeta(meta: RawEvent["meta"]): string {
  if (!meta || Object.keys(meta).length === 0) return "No extra metadata for this event.";
  return JSON.stringify(meta, null, 2);
}

export function AuditGridDashboard() {
  const gridRef = useRef<AgGridReact<AuditRow>>(null);
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [rawEvents, setRawEvents] = useState<RawEvent[]>([]);
  const [selected, setSelected] = useState<RawEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [quickFilter, setQuickFilter] = useState("");
  const [preset, setPreset] = useState<ViewPreset>("all");
  const [nlFilter, setNlFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/audit?limit=200");
    if (res.ok) {
      const data = (await res.json()) as { events: RawEvent[] };
      setRawEvents(data.events);
      setRows(toRows(data.events));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const captured = rawEvents.filter((e) => e.type === "paypal.captured");
    const blocked = rawEvents.filter((e) => e.type === "policy.blocked");
    const agent = rawEvents.filter((e) => e.type === "agent.draft");
    const amountByOrder = new Map<string, number>();
    for (const e of rawEvents) {
      const orderId = e.meta?.orderId != null ? String(e.meta.orderId) : "";
      const amt = Number(e.meta?.amountUsd);
      if (orderId && Number.isFinite(amt)) amountByOrder.set(orderId, amt);
    }
    const volume = captured.reduce((sum, e) => {
      let n = Number(e.meta?.amountUsd);
      if (!Number.isFinite(n) && e.meta?.orderId) {
        n = amountByOrder.get(String(e.meta.orderId)) ?? NaN;
      }
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
    return {
      total: rawEvents.length,
      captured: captured.length,
      blocked: blocked.length,
      agent: agent.length,
      volume,
    };
  }, [rawEvents]);

  const columnDefs = useMemo<ColDef<AuditRow>[]>(
    () => [
      { field: "time", headerName: "Time", flex: 1.2, minWidth: 160 },
      {
        field: "rawType",
        headerName: "Event",
        flex: 1.1,
        minWidth: 150,
        cellRenderer: EventTypeCell,
      },
      { field: "payee", headerName: "Payee", flex: 1, minWidth: 120 },
      {
        field: "amountUsd",
        headerName: "Amount USD",
        flex: 0.7,
        minWidth: 110,
        type: "numericColumn",
      },
      { field: "summary", headerName: "Summary", flex: 2, minWidth: 200 },
      { field: "orderId", headerName: "Order ID", flex: 1, minWidth: 120 },
      { field: "captureId", headerName: "Capture ID", flex: 1, minWidth: 120 },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  );

  const applyPreset = (next: ViewPreset) => {
    setPreset(next);
    const api: GridApi<AuditRow> | undefined = gridRef.current?.api;
    if (!api) return;
    api.setFilterModel(null);
    if (next === "captures") {
      api.setFilterModel({
        rawType: {
          filterType: "text",
          type: "equals",
          filter: "paypal.captured",
        },
      });
    } else if (next === "policy") {
      api.setFilterModel({
        rawType: {
          filterType: "text",
          type: "contains",
          filter: "policy",
        },
      });
    } else if (next === "agent") {
      api.setFilterModel({
        rawType: {
          filterType: "text",
          type: "contains",
          filter: "agent",
        },
      });
    }
  };

  const applyNlFilter = () => {
    const text = nlFilter.toLowerCase();
    const api = gridRef.current?.api;
    if (!api) return;

    if (!text.trim()) {
      setQuickFilter("");
      return;
    }

    if (text.includes("capture") || text.includes("paid")) {
      applyPreset("captures");
      return;
    }
    if (text.includes("policy") || text.includes("block")) {
      applyPreset("policy");
      return;
    }
    if (text.includes("agent") || text.includes("draft")) {
      applyPreset("agent");
      return;
    }
    if (text.includes("over") && text.match(/\d+/)) {
      const n = Number.parseFloat(text.match(/\d+/)?.[0] ?? "0");
      api.setFilterModel({
        amountUsd: {
          filterType: "number",
          type: "greaterThan",
          filter: n,
        },
      });
      setPreset("all");
      return;
    }

    setQuickFilter(nlFilter);
    setPreset("all");
    api.setFilterModel(null);
  };

  const onRowSelected = (e: RowSelectedEvent<AuditRow>) => {
    if (!e.data || !e.node.isSelected()) return;
    const raw = rawEvents.find((x) => x.id === e.data?.id) ?? null;
    setSelected(raw);
  };

  const exportCsv = () => {
    gridRef.current?.api?.exportDataAsCsv({
      fileName: `capstan-audit-${new Date().toISOString().slice(0, 10)}.csv`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-[28px]">
          Finance dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
          AG Grid cockpit for Capstan audit events: filters, export, and row
          level inspection for PayPal sandbox runs and agent drafts.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Events", String(stats.total)],
          ["Captures", String(stats.captured)],
          ["Policy blocks", String(stats.blocked)],
          ["Captured volume", `$${stats.volume.toFixed(2)}`],
        ].map(([label, value]) => (
          <Card key={label} padding="md" className="bg-surface/80">
            <p className="text-xs font-medium uppercase tracking-wide text-text-faint">
              {label}
            </p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-text">
              {value}
            </p>
          </Card>
        ))}
      </div>

      <Card padding="md">
        <CardHeader
          title="Controls"
          description="Presets and natural language shortcuts map to AG Grid filter models (no extra API cost)."
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All events"],
              ["captures", "Captures"],
              ["policy", "Policy"],
              ["agent", "Agent drafts"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              variant={preset === key ? "primary" : "secondary"}
              size="sm"
              onClick={() => applyPreset(key)}
            >
              {label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => void load()}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            className="h-10 flex-1 rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-text"
            placeholder='Try: "show captures" or "policy blocks" or "over 100"'
            value={nlFilter}
            onChange={(e) => setNlFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyNlFilter();
            }}
          />
          <Button size="sm" onClick={applyNlFilter}>
            Apply view
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div
          className="ag-theme-quartz-dark overflow-hidden rounded-[var(--radius-lg)] border border-border"
          style={{ height: 480, width: "100%" }}
        >
          <AgGridReact<AuditRow>
            ref={gridRef}
            theme="legacy"
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilter}
            animateRows
            rowSelection={{ mode: "singleRow", checkboxes: false }}
            onRowSelected={onRowSelected}
            loading={loading}
            overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading audit events…</span>'
            overlayNoRowsTemplate='<span class="ag-overlay-loading-center">No audit events yet. Run a payment from Console.</span>'
          />
        </div>

        <Card padding="md" className="h-fit lg:sticky lg:top-24">
          <CardHeader
            title="Event inspector"
            description="Select a row to see PayPal IDs and policy metadata."
          />
          {selected ? (
            <div className="space-y-3 text-sm">
              <p className="text-text-muted">{selected.summary}</p>
              <p className="font-mono text-xs text-text-faint">{selected.at}</p>
              <pre className="max-h-64 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg p-3 font-mono text-xs text-text-muted">
                {formatMeta(selected.meta)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              Click a capture or policy row to inspect order and capture IDs.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
