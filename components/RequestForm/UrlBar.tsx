"use client";

import { METHOD_COLORS, HITTABLE_METHODS } from "@/constants";
import useKeypress from "@/hooks/useKeypress";
import { curlConverter, jsonToCurl } from "@/utils/curlConverter";
import { hittableProxy } from "@/utils/hittableProxy";
import { getParamsfromUrl } from "@/utils/responsePanelUtils";
import { CheckCircle2, Code2, Loader2, Save, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { useDataContext } from "@/context/dataContext";

export default function UrlBar({
  handleSaveCollection,
  isUnsaved,
  error,
}: {
  handleSaveCollection: () => void;
  isUnsaved: () => boolean;
  error: string | null;
}) {
  const { formInput, setFormInput, extensionAvailable, setProxyResponse , selectorResponse } = useDataContext();

  const {env} = selectorResponse!;
  const mc = METHOD_COLORS[formInput.method] ?? "#94a3b8";

  const [curlCopied, setCurlCopied] = useState(false);
  const [proxyLoading, setProxyLoading] = useState(false);

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(jsonToCurl(formInput));
    setCurlCopied(true);
    setTimeout(() => setCurlCopied(false), 2000);
  };

  const sendProxyRequest = useCallback(async () => {
    setProxyLoading(true);
    setProxyResponse(null);
    try {
      const res = await hittableProxy(
        formInput,
        env,
        extensionAvailable,
      );
      setProxyResponse(res);
    } catch (err) {
      setProxyResponse({ error: String(err) });
    } finally {
      setProxyLoading(false);
    }
  }, [
    setProxyResponse,
    formInput,
    env,
    extensionAvailable,
  ]);

  function handleUrlPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").trim();

    if (!pasted.startsWith("curl ")) return;

    setFormInput({ ...formInput, url: pasted });

    e.preventDefault(); // stop it from being typed into the input
    const parsed = curlConverter(pasted);
    setTimeout(() => {
      setFormInput(parsed);
    }, 1000);
  }

  useKeypress({
    key: "Enter",
    isMeta: true,
    func: sendProxyRequest,
  });

  useKeypress({
    key: "s",
    isMeta: true,
    func: handleSaveCollection,
  });

  return (
    <div
      className="relative flex items-center gap-2 rounded-lg border bg-[#0a1628] px-2 py-1.5 transition-all"
      style={{ borderColor: `${mc}33`, boxShadow: `0 0 20px ${mc}0d` }}
    >
      {/* Corner brackets */}
      <span
        className="absolute top-0 left-0 w-3 h-3 border-t border-l rounded-tl-lg"
        style={{ borderColor: `${mc}44` }}
      />
      <span
        className="absolute top-0 right-0 w-3 h-3 border-t border-r rounded-tr-lg"
        style={{ borderColor: `${mc}44` }}
      />
      <span
        className="absolute bottom-0 left-0 w-3 h-3 border-b border-l rounded-bl-lg"
        style={{ borderColor: `${mc}44` }}
      />
      <span
        className="absolute bottom-0 right-0 w-3 h-3 border-b border-r rounded-br-lg"
        style={{ borderColor: `${mc}44` }}
      />

      <select
        className="shrink-0 rounded-md border-0 bg-[#0e1f35] px-2 py-1.5 text-xs font-bold tracking-widest outline-none cursor-pointer"
        style={{ color: mc }}
        value={formInput.method}
        onChange={(e) => setFormInput({ ...formInput, method: e.target.value })}
      >
        {HITTABLE_METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="h-4 w-px bg-white/10" />

      <input
        className="min-w-0 flex-1 bg-transparent py-1 text-sm text-white/80 placeholder-white/20 outline-none"
        type="text"
        placeholder="https://api.example.com/endpoint"
        value={formInput.url}
        onChange={(e) => setFormInput({ ...formInput, url: e.target.value, params : getParamsfromUrl(e.target.value) })}
        onPaste={handleUrlPaste}
        spellCheck={false}
      />

      <div className="flex items-center gap-1.5">
        <button
          title="Save (Ctrl/Cmd+S)"
          disabled={!isUnsaved()}
          onClick={handleSaveCollection}
          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/40 transition-all cursor-pointer hover:border-cyan-500/30 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <Save className="h-3 w-3" />
          Save
        </button>

        <button
          title="Send (Ctrl/Cmd+Enter)"
          disabled={proxyLoading || !!error}
          onClick={sendProxyRequest}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-black transition-all  cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
          style={{ background: mc, boxShadow: `0 0 12px ${mc}44` }}
        >
          {proxyLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
          {proxyLoading ? "Sending…" : "Send"}
        </button>

        <button
          title="Copy as CURL"
          disabled={curlCopied}
          onClick={handleCopyCurl}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-black transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
          style={{ background: mc, boxShadow: `0 0 12px ${mc}44` }}
        >
          {curlCopied ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <Code2 className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
}
