import { NextResponse, NextRequest } from "next/server";
import { parseStringToJson } from "@/utils/JsonStringParsing";

export async function POST(req: NextRequest) {
  const { url, method, headers: incomingHeaders, body } = await req.json();

  const headers = {
    ...parseStringToJson(incomingHeaders),
    "content-type": "application/json",
  };

  try {
    const noBodyMethods = ["GET", "DELETE", "HEAD"];
    const hasBody = !noBodyMethods.includes(method);
    const response = await fetch(url, {
      method,
      headers,
      body: hasBody ? body || undefined : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    // HEAD responses have no body — return headers instead
    if (method === "HEAD") {
      const headersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      return NextResponse.json(headersObj);
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json({
      data,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
