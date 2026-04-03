// Respond to page polling
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data?.type === "POSTBOX_PING") {
    window.postMessage({ type: "POSTBOX_EXTENSION_READY" }, "*");
  }

  if (event.data?.type === "POSTBOX_REQUEST") {
    chrome.runtime.sendMessage(event.data, (response) => {
      window.postMessage({ type: "POSTBOX_RESPONSE", ...response }, "*");
    });
  }
});