import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AuditEvent } from "./audit";

function getDataDir(): string {
  if (process.env.CAPSTAN_AUDIT_DIR?.trim()) {
    return process.env.CAPSTAN_AUDIT_DIR.trim();
  }
  // Vercel serverless: project dir is read-only; /tmp is writable for the invocation.
  if (process.env.VERCEL) {
    return path.join("/tmp", "capstan-audit");
  }
  return path.join(process.cwd(), ".data");
}

function auditFilePath(): string {
  return path.join(getDataDir(), "audit-events.json");
}

export async function readAuditEvents(): Promise<AuditEvent[]> {
  try {
    const raw = await readFile(auditFilePath(), "utf8");
    const parsed = JSON.parse(raw) as AuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeAuditEvents(events: AuditEvent[]): Promise<void> {
  const dir = getDataDir();
  await mkdir(dir, { recursive: true });
  await writeFile(auditFilePath(), JSON.stringify(events, null, 2), "utf8");
}
