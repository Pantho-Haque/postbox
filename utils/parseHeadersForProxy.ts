export function parseHeaders(raw: string): Record<string, string> {
  if (!raw.trim()) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    // fallback for plain "Key: Value" format
    return Object.fromEntries(
      raw
        .split("\n")
        .map((line) => line.split(": ").map((s) => s.trim()))
        .filter((parts) => parts.length === 2) as [string, string][]
    );
  }
}
