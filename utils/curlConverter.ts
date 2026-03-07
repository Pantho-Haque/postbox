import { TPostBoxCurlJson } from "@/types";

/**
 * Parses a curl command string (including multi-line ones with \ continuations)
 * into its constituent parts.
 *
 * Example input:
 *   curl -X POST https://jsonplaceholder.typicode.com/posts \
 *     -H "Content-Type: application/json" \
 *     -d '{"title": "Marshal Post", "body": "Created via marshal", "userId": 2}'
 */
export function curlConverter(curlString: string): TPostBoxCurlJson {
  // Step 1: Collapse backslash line-continuations into a single line
  // Template literals store them as literal "\" + "\n" + whitespace
  const normalized = curlString.replace(/\\\n\s*/g, " ").trim();

  // Step 2: Parse each flag individually
  const methodMatch = normalized.match(/curl\s+-X\s+([A-Z]+)/i);
  const urlMatch = normalized.match(/curl\s+(?:-X\s+[A-Z]+\s+)?(\S+)/i);
  const headerMatches = [...normalized.matchAll(/-H\s+"([^"]+)"/g)];
  const bodyMatch = normalized.match(/-d\s+'([\s\S]+?)'(?:\s|$)/);

  const headersObj = headerMatches.reduce(
    (acc, match) => {
      const [key, ...rest] = match[1].split(": ");
      acc[key] = rest.join(": ");
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    method: methodMatch?.[1] ?? "GET",
    url: urlMatch?.[1] ?? "https://jsonplaceholder.typicode.com/users/1",
    headers: JSON.stringify(headersObj),
    body: bodyMatch?.[1] ?? ""
  };
}

export function jsonToCurl(json: TPostBoxCurlJson): string {
  let curl = `curl -X ${json.method} ${json.url}`;

  if (json.headers) {
    try {
      const headersObj = JSON.parse(json.headers);
      for (const [key, value] of Object.entries(headersObj)) {
        curl += ` -H "${key}: ${value}"`;
      }
    } catch {
      // fallback plain "Key: Value" format
      json.headers.split("\n").forEach((line) => {
        if (line.trim()) curl += ` -H "${line.trim()}"`;
      });
    }
  }

  //&& json.method !== "GET" && json.method !== "DELETE"
  if (json.body) {
    curl += ` -d '${json.body}'`;
  }

  return curl;
}
