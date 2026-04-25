import { TPostBoxCurlJson } from "@/types";
import parse from "@bany/curl-to-json";

export function curlConverter(curlString: string): TPostBoxCurlJson {

  const parsed =curlString?  parse(curlString): {
    method: "GET",
    url: "",
    params:{},
    header: {},
    data: {},
  };
  // Keep URL exactly as written in curl input to avoid
  // any query re-encoding (e.g. "+" -> "%2B", ":" -> "%3A").
  const rawUrlFromCurl =
    curlString.match(/https?:\/\/[^\s"'\\]+/)?.[0] ||
    curlString.match(/(['"])(https?:\/\/.*?)(\1)/)?.[2] ||
    "";

  const extractRawParams = (url: string): Record<string, string | string[]> => {
    const query = url.split("?")[1]?.split("#")[0] || "";
    if (!query) return {};

    return query.split("&").reduce<Record<string, string | string[]>>((acc, pair) => {
      if (!pair) return acc;
      const [rawKey, ...rawValueParts] = pair.split("=");
      if (!rawKey) return acc;

      const rawValue = rawValueParts.join("=");
      const existing = acc[rawKey];

      if (existing === undefined) {
        acc[rawKey] = rawValue;
      } else if (Array.isArray(existing)) {
        existing.push(rawValue);
      } else {
        acc[rawKey] = [existing, rawValue];
      }

      return acc;
    }, {});
  };

  const rawParams = extractRawParams(rawUrlFromCurl || parsed.url || "");

  return {
    method: parsed.method || "GET",
    url: rawUrlFromCurl || parsed.url || "",
    params: JSON.stringify(
      Object.keys(rawParams).length ? rawParams : (parsed.params ?? {}),
    ),
    headers: JSON.stringify(parsed.header) || "",
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