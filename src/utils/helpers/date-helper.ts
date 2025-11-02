export function toUTCISO(date?: string | Date | null): string {
  const d = date ? new Date(date) : new Date();
  return d.toISOString(); // Always UTC ISO format
}

export function toSQLiteDate(date?: string | Date | null): string {
  const d = date ? new Date(date) : new Date();
  return d.toISOString().slice(0, 19).replace("T", " ");
}

