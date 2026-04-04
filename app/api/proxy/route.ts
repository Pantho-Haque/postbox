import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { url, method, headers: clientHeaders, body } = await req.json();

  let parsedHeaders: Record<string, string> = {};
  try {
    parsedHeaders = typeof clientHeaders === "string"
      ? JSON.parse(clientHeaders || "{}")
      : clientHeaders ?? {};
  } catch {
    parsedHeaders = {};
  }

  const blocked = ["host", "content-length", "transfer-encoding", "connection"];
  blocked.forEach((h) => {
    delete parsedHeaders[h];
    delete parsedHeaders[h.toLowerCase()];
  });

  const noBody = ["GET", "HEAD"].includes(method.toUpperCase());
  const bodyToSend = noBody
    ? undefined
    : typeof body === "string" ? body : JSON.stringify(body);


  const upstream = await fetch(url, {
    method: method.toUpperCase(),
    headers: parsedHeaders,
    body: bodyToSend,
  });

  const isHead = method.toUpperCase() === "HEAD";
  const contentType = upstream.headers.get("content-type") ?? "";
  const data = isHead
    ? null
    : contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

  const responseHeaders: Record<string, string> = {};
  upstream.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  const cookies: Record<string, string> = {};
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) {
    setCookie.split(",").forEach((part) => {
      const [pair] = part.trim().split(";");
      const eqIdx = pair.indexOf("=");
      if (eqIdx !== -1) {
        const k = pair.slice(0, eqIdx).trim();
        const v = pair.slice(eqIdx + 1).trim();
        cookies[k] = v;
      }
    });
  }

  return NextResponse.json({
    data: isHead ? responseHeaders : data,
    status: upstream.status,
    statusText: upstream.statusText,
    ok: upstream.ok,
    headers: responseHeaders,
    cookies,
  });
}