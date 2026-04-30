import { TPostBoxCurlJson } from "@/types";
import parse, { ResultJSON } from "@bany/curl-to-json";
import { formatJson } from "./formatJson";

export function curlConverter(curlString: string): TPostBoxCurlJson {
  if (!curlString) return { method: "GET", url: "", params: "{}", headers: "{}", body: "{}" };

  // 1. REGEX to extract the URL before the parser breaks
  // This looks for anything after 'curl', '-X GET', etc., that looks like a URL/Placeholder
  const urlRegex = /(?:https?:\/\/|<<)[^\s"']+/;
  const rawUrlFromCurl = curlString.match(urlRegex)?.[0] || "";

  // 2. SHIELD the entire curl string 
  // Replace <<var>> with a safe word so the Parser doesn't crash
  const shieldedCurl = curlString.replace(/<<(\w+)>>/g, 'PH_$1_PH');

  let parsed: ResultJSON;
  try {
    // We parse the shielded version
    parsed = parse(shieldedCurl);
  } catch {
    // Fallback if the parser still hates the string
    parsed = { url: rawUrlFromCurl, origin: rawUrlFromCurl, method: "GET", header: {}, data: {} };
  }

  // 3. Helper to swap "PH_var_PH" back to "<<var>>"
  const unshield = (val: string): string => {
    return val.replace(/PH_(\w+)_PH/g, '<<$1>>');
  };

  // 4. Manual Query Parameter Extraction (to avoid URL encoding issues)
  const extractParams = (url: string) => {
    const queryPart = url.split('?')[1];
    if (!queryPart) return {};
    
    return queryPart.split('&').reduce((acc: Record<string, string>, pair: string) => {
      const [k, v] = pair.split('=');
      if (k) acc[unshield(k)] = unshield(v || "");
      return acc;
    }, {});
  };

  // 5. Clean up Headers and Body
  const cleanObj = (obj: Record<string, string>) => {
    const newObj: Record<string, string> = {};
    Object.entries(obj || {}).forEach(([k, v]) => {
      newObj[unshield(k)] = unshield(v);
    });
    return newObj;
  };

  return {
    method: parsed.method || "GET",
    url: rawUrlFromCurl, // Use the raw one we grabbed at the start
    params: formatJson(extractParams(rawUrlFromCurl)).output,
    headers: formatJson(cleanObj(parsed.header as Record<string, string>)).output,
    body: formatJson(cleanObj(parsed.data)).output,
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