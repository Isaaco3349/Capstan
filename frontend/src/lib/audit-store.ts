import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AuditEvent } from "./audit";

const DATA_DIR = path.join(process.cwd(), ".data");
const AUDIT_FILE = path.join(DATA_DIR, "audit-events.json");

export async function readAuditEvents(): Promise<AuditEvent[]> {
  try {
    const raw = await readFile(AUDIT_FILE, "utf8");
    const parsed = JSON.parse(raw) as AuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeAuditEvents(events: AuditEvent[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(AUDIT_FILE, JSON.stringify(events, null, 2), "utf8");
}
