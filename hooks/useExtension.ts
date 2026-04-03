"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window { __postboxExtension?: boolean; }
}

export function useExtension() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "POSTBOX_EXTENSION_READY") {
        window.__postboxExtension = true;
        setAvailable(true);
      }
    };

    window.addEventListener("message", handler);

    // Poll every 500ms for 5s then give up
    let attempts = 0;
    const poll = setInterval(() => {
      window.postMessage({ type: "POSTBOX_PING" }, "*");
      attempts++;
      if (attempts >= 10) clearInterval(poll);
    }, 500);

    return () => {
      window.removeEventListener("message", handler);
      clearInterval(poll);
    };
  }, []);

  return available;
}