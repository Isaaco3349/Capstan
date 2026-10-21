"use client";

import type { CustomCellRendererProps } from "ag-grid-react";
import { Badge } from "../ui/Badge";

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

export function EventTypeCell(params: CustomCellRendererProps) {
  const raw = String(params.value ?? params.data?.rawType ?? "");
  if (!raw) return null;
  return (
    <Badge tone={toneForType(raw)}>{labelForType(raw)}</Badge>
  );
}
