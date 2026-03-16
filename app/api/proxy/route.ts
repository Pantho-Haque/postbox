import { NextResponse, NextRequest } from "next/server";
import { parseStringToJson } from "@/utils/JsonStringParsing";

export async function POST(req: NextRequest) {
  const { url, method, headers: incomingHeaders, body } = await req.json();

  const headers = {
    ...parseStringToJson(incomingHeaders),
    "content-type": "application/json",
  };

  try {
    const hasBody = method === "GET" || method === "DELETE";
    const response = await fetch(url, {
      method,
      headers,
      body: hasBody ? undefined : body || undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
