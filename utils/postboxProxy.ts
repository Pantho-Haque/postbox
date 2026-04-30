import { TPostBoxCurlJson, TPostBoxEnv } from "@/types";
import { resolveEnv } from "./postboxCollectionModifier";

const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "0.0.0.0"];

function isLocalUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return LOCAL_HOSTNAMES.some((h) => hostname === h);
  } catch {
    return false;
  }
}


export function fetchViaExtension(
  url: string,
  method: string,
  headers: Record<string, string>,
  body: string | null,
): Promise<{ data: unknown; status: number; ok: boolean; error?: string }> {
  return new Promise((resolve, reject) => {
    window.postMessage({ type: "POSTBOX_REQUEST", payload: { url, method, headers, body } }, "*");

    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "POSTBOX_RESPONSE") return;
      window.removeEventListener("message", handler);
      if (event.data.success) resolve(event.data);
      else reject(new Error(event.data.error));
    };

    window.addEventListener("message", handler);

    // Timeout after 10s
    setTimeout(() => {
      window.removeEventListener("message", handler);
      reject(new Error("Extension request timed out"));
    }, 10000);
  });
}

async function fetchViaProxy(
  url: string,
  method: string,
  headers: string,
  body: unknown,
) {
  const response = await fetch("/api/proxy", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, method, headers, body }),
  });

  const responseData = await response.json();
  return responseData;
}

export async function postboxProxy(
  formInput: TPostBoxCurlJson,
  env: TPostBoxEnv | undefined,
  extensionAvailable: boolean,
) {
  const {url, method, headers, body} = resolveEnv(formInput, env);
  
  const isLocal = isLocalUrl(url);
  if (isLocal && extensionAvailable) {
    return fetchViaExtension(url, method, JSON.parse(headers), body);
  }

  if (isLocal && !extensionAvailable) {
    throw new Error("Install the Postbox Extension to make localhost requests");
  }

  return fetchViaProxy(url, method, headers, body);
}

