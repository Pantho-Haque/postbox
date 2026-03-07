function parseHeaders(raw: string): Record<string, string> {
  if (!raw.trim()) return {};
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

export async function postboxProxy(
  url: string,
  method: string,
  headers: string, 
  body: string,
) {
  const response = await fetch(url, {
    method,
    headers: parseHeaders(headers), 
    body: method === "GET" || method === "DELETE" ? undefined : body || undefined,
  });
  const responseData = await response.json();
  
  return {
    data: responseData,
    status: response.status,
    headers: response.headers,
  };
}
