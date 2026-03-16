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
  // 1. Clean up line breaks
  const normalized = curlString.replace(/\\\n\s*/g, " ").trim();

  // 2. Handle Method
  let method = "GET";
  if (normalized.includes(" -I") || normalized.includes(" --head")) {
    method = "HEAD";
  } else {
    const methodMatch = normalized.match(/-X\s+([A-Z]+)/i);
    method = methodMatch?.[1].toUpperCase() ?? "GET";
  }

  // 3. Extract Headers
  const headerMatches = [...normalized.matchAll(/-H\s+["']([^"']+)["']/g)];
  const headersObj = headerMatches.reduce((acc, match) => {
    const parts = match[1].split(":");
    const key = parts[0].trim();
    const value = parts.slice(1).join(":").trim();
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  // 4. Extract Body
  const bodyMatch = normalized.match(/-d\s+['"]([\s\S]+?)['"](?:\s|$)/);

  // 5. Extract URL (The Trickiest Part)
  // Remove the 'curl' command and all known flags/values to find the naked URL
  let url = "";
  const words = normalized.split(/\s+/);
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const prev = words[i - 1];

    // If the word is a flag or a value belonging to a flag, skip it
    if (word.startsWith("-")) continue;
    if (["-X", "-H", "-d", "--data"].includes(prev)) continue;
    
    // The first word that isn't a flag or a flag-value is usually our URL
    if (word.startsWith("http")) {
      url = word.replace(/['"]/g, ""); // Remove quotes if present
      break;
    }
  }

  return {
    method,
    url,
    headers: JSON.stringify(headersObj),
    body: bodyMatch?.[1] ?? ""
  };
}


export function jsonToCurl(json: TPostBoxCurlJson): string {
  let methodPart = `-X ${json.method}`;
  
  // Use the standard curl shorthand for HEAD
  if (json.method === "HEAD") {
    methodPart = "-I";
  }

  let curl = `curl ${methodPart} ${json.url}`;

  if (json.headers) {
    try {
      const headersObj = JSON.parse(json.headers);
      for (const [key, value] of Object.entries(headersObj)) {
        curl += ` -H "${key}: ${value}"`;
      }
    } catch {
      // fallback
    }
  }

  // Only add body if it exists and isn't a GET/HEAD/DELETE
  const noBodyMethods = ["GET", "HEAD", "DELETE"];
  if (json.body && !noBodyMethods.includes(json.method.toUpperCase())) {
    curl += ` -d '${json.body}'`;
  }

  return curl;
}