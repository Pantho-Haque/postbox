export async function postboxProxy(
  url: string,
  method: string,
  headers: string, 
  body: unknown,
) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        method,
        headers, 
        body: body,
      }),
    });

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status,
      ok: response.ok,
      headers: response.headers,
    };
  } catch (error) {
    console.error("Frontend Proxy Helper Error:", error);
    return {
      data: { error: "Network request failed" },
      status: 500,
      ok: false,
      headers: {},
    };
  }
}
