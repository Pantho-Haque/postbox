const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "0.0.0.0"];

function isLocalUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return LOCAL_HOSTNAMES.some((h) => hostname === h);
  } catch {
    return false;
  }
}

async function fetchDirect(
  url: string,
  method: string,
  headers: string,
  body: unknown,
) {
  const parsedHeaders = typeof headers === "string" ? JSON.parse(headers || "{}") : headers;

  const response = await fetch(url, {
    method,
    headers: parsedHeaders,
    body: ["GET", "HEAD"].includes(method.toUpperCase()) ? undefined : JSON.stringify(body),
  });

  const responseData = await response.json();

  return {
    data: responseData,
    status: response.status,
    ok: response.ok,
    headers: response.headers,
  };
}

async function fetchViaProxy(
  url: string,
  method: string,
  headers: string,
  body: unknown,
) {
  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, method, headers, body }),
  });

  const responseData = await response.json();

  return {
    data: responseData,
    status: response.status,
    ok: response.ok,
    headers: response.headers,
  };
}

export async function postboxProxy(
  url: string,
  method: string,
  headers: string,
  body: unknown,
) {
  try {
    if (isLocalUrl(url)) {
      return await fetchDirect(url, method, headers, body);
    }
    return await fetchViaProxy(url, method, headers, body);
  } catch (error) {
    console.error("Proxy Error:", error);
    return {
      data: { error: "Network request failed" },
      status: 500,
      ok: false,
      headers: {},
    };
  }
}