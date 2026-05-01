// Respond to page polling
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data?.type === "HITTABLE_PING") {
    window.postMessage({ type: "HITTABLE_EXTENSION_READY" }, "*");
  }

  if (event.data?.type === "HITTABLE_REQUEST") {
    chrome.runtime.sendMessage(event.data, (response) => {
      window.postMessage({ type: "HITTABLE_RESPONSE", ...response }, "*");
    });
  }
});