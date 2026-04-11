import { TPostBoxCurlJson } from "@/types";
import parse from "@bany/curl-to-json";

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
  // 1. Clean up line continuations
  const parsed =curlString?  parse(curlString): {
    method: "GET",
    url: "",
    header: {},
    data: {},
  };
  // const normalized = curlString.replace(/\\\n\s*/g, " ").trim();

  // // 2. Method — handle both -X and --request
  // let method = "GET";
  // if (normalized.includes(" -I ") || normalized.includes(" --head ")) {
  //   method = "HEAD";
  // } else {
  //   const methodMatch = normalized.match(/(?:-X|--request)\s+([A-Z]+)/i); // ← add --request
  //   method = methodMatch?.[1].toUpperCase() ?? "GET";
  // }

  // // 3. Headers — handle both -H and --header
  // const headerMatches = [...normalized.matchAll(/(?:-H|--header)\s+["']([^"']+)["']/g)]; // ← add --header
  // const headersObj = headerMatches.reduce((acc, match) => {
  //   const parts = match[1].split(":");
  //   const key = parts[0].trim();
  //   const value = parts.slice(1).join(":").trim();
  //   acc[key] = value;
  //   return acc;
  // }, {} as Record<string, string>);

  // // 4. Body — handle -d and --data
  // const bodyMatch = normalized.match(/(?:-d|--data)\s+'([\s\S]+)'/);

  // // 5. URL — handle --url flag AND naked URLs
  // let url = "";
  // const urlFlagMatch = normalized.match(/(?:--url|--location)\s+["']?([^\s"']+)["']?/); 
  // if (urlFlagMatch) {
  //   url = urlFlagMatch[1];
  // } else {
  //   const words = normalized.split(/\s+/);
  //   const skipNext = new Set(["-X", "--request", "-H", "--header", "-d", "--data", "--url"]);
  //   for (let i = 1; i < words.length; i++) {
  //     const word = words[i];
  //     const prev = words[i - 1];
  //     if (word.startsWith("-")) continue;
  //     if (skipNext.has(prev)) continue;
  //     if (word.startsWith("http")) {
  //       url = word.replace(/['"]/g, "");
  //       break;
  //     }
  //   }
  // }

  // return {
  //   method,
  //   url,
  //   headers: JSON.stringify(headersObj),
  //   body: bodyMatch?.[1] ?? "",
  // };
  return {
    method: parsed.method || "GET",
    url: parsed.url,
    headers: JSON.stringify(parsed.header),
    body: JSON.stringify(parsed.data) || "",
  }
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