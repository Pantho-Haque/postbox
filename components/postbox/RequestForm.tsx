"use client";
import { POSTBOX_METHODS } from "@/constants";
import {
  TPostBoxCollections,
  TPostBoxCurlJson,
  TPostBoxEnv,
  TPostBoxSelectorResponse,
  TResponseJson,
} from "@/types";
import { jsonToCurl } from "@/utils/curlConverter";
import { formatJson } from "@/utils/formatJson";
import { updateCurl } from "@/utils/postboxCollectionModifier";
import { postboxProxy } from "@/utils/postboxProxy";
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  Loader2,
  MessageCircleWarning,
  Save,
  Send,
} from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { useExtension } from "@/hooks/useExtension";
import NoExtensionModal from "../modals/NoExtensionModal";

function resolveEnv(text: string, env?: TPostBoxEnv): string {
  if (!env) return text;
  return text.replace(/<<(\w+)>>/g, (_, key) => env[key] ?? `<<${key}>>`);
}

const METHOD_COLORS: Record<string, string> = {
  GET: "#00e5cc",
  POST: "#4ade80",
  PUT: "#fb923c",
  PATCH: "#a78bfa",
  DELETE: "#f87171",
  HEAD: "#94a3b8",
  OPTIONS: "#94a3b8",
};

export default function RequestForm({
  selectorResponse,
  setCollections,
  setSelectorResponse,
}: {
  selectorResponse: TPostBoxSelectorResponse;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectorResponse: Dispatch<
    SetStateAction<TPostBoxSelectorResponse | null>
  >;
}) {
  const { collectionName, curlName, env, curlJson, responseJson } =
    selectorResponse;

  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");
  const [curlCopied, setCurlCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { available: extensionAvailable, checked: extensionChecked } =
  useExtension();


  const [formInput, setFormInput] = useState<TPostBoxCurlJson>({
    ...curlJson,
    body: formatJson(curlJson.body).output,
    headers: formatJson(curlJson.headers).output,
  });


  const [proxyLoading, setProxyLoading] = useState(false);
  const [proxyResponse, setProxyResponse] = useState<TResponseJson>(
    responseJson ?? null,
  );

  const sendProxyRequest = useCallback(async () => {
    setProxyLoading(true);
    setProxyResponse(null);
    try {
      const res = await postboxProxy(
        resolveEnv(formInput.url, env),
        formInput.method,
        resolveEnv(formInput.headers, env),
        resolveEnv(formInput.body, env),
        extensionAvailable
      );
      setProxyResponse(res);
    } catch (err) {
      setProxyResponse({ error: String(err) });
    } finally {
      setProxyLoading(false);
    }
  }, [formInput, env, extensionAvailable]);

  const isUnsaved = useCallback(() => {
    const normalize = (s: string) => {
      try {
        return JSON.stringify(JSON.parse(s || "{}"));
      } catch {
        return s.trim();
      }
    };
    return (
      formInput.method !== curlJson.method ||
      formInput.url !== curlJson.url ||
      normalize(formInput.body) !== normalize(curlJson.body) ||
      normalize(formInput.headers) !== normalize(curlJson.headers) ||
      normalize(JSON.stringify(proxyResponse)) !==
        normalize(JSON.stringify(responseJson))
    );
  }, [
    formInput.method,
    formInput.url,
    formInput.body,
    formInput.headers,
    curlJson.method,
    curlJson.url,
    curlJson.body,
    curlJson.headers,
    proxyResponse,
    responseJson,
  ]);

  const handleSaveCollection = useCallback(() => {
    setSelectorResponse({
      collectionName,
      curlName,
      env,
      curlJson: formInput,
      responseJson: proxyResponse,
    });
    setCollections((prev) =>
      updateCurl(
        prev,
        collectionName,
        curlName,
        jsonToCurl(formInput),
        JSON.stringify(proxyResponse),
      ),
    );
  }, [
    setSelectorResponse,
    collectionName,
    curlName,
    env,
    formInput,
    proxyResponse,
    setCollections,
  ]);

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(jsonToCurl(formInput));
    setCurlCopied(true);
    setTimeout(() => setCurlCopied(false), 2000);
  }

  useEffect(() => {
    setFormInput({
      ...curlJson,
      body: formatJson(curlJson.body).output,
      headers: formatJson(curlJson.headers).output,
    });
    setError(null);
    setProxyResponse(responseJson ?? null);
  }, [curlJson, responseJson]);
  
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveCollection();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        sendProxyRequest();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleSaveCollection, sendProxyRequest]);

  const mc = METHOD_COLORS[formInput.method] ?? "#94a3b8";
  const statusOk = proxyResponse?.status != null && proxyResponse.status < 300;
  const statusWarn =
    proxyResponse?.status != null &&
    proxyResponse.status >= 300 &&
    proxyResponse.status < 500;

  return (
    <div className="h-full w-full flex flex-col gap-4 font-mono">
      {/* ── Breadcrumb ── */}
      <NoExtensionModal
        checked={extensionChecked}
        available={extensionAvailable}
      />
      <div className="flex items-center gap-2">
        <span className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/40">
          {collectionName}
        </span>
        <span className="text-white/10 text-xs">/</span>
        <span className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/70">
          {curlName}
        </span>
      </div>

      {/* ── URL Bar ── */}
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
          onChange={(e) =>
            setFormInput({ ...formInput, method: e.target.value })
          }
        >
          {POSTBOX_METHODS.map((m) => (
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
          onChange={(e) => setFormInput({ ...formInput, url: e.target.value })}
          spellCheck={false}
        />

        <div className="flex items-center gap-1.5">
          <button
            title="Save (Ctrl/Cmd+S)"
            disabled={!isUnsaved()}
            onClick={handleSaveCollection}
            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/40 transition-all hover:border-cyan-500/30 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-20"
          >
            <Save className="h-3 w-3" />
            Save
          </button>

          <button
            title="Send (Ctrl/Cmd+Enter)"
            disabled={proxyLoading || !!error}
            onClick={sendProxyRequest}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-black transition-all disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
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
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-black transition-all disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
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

      {/* ── Status strip ── */}
      {(isUnsaved() || error) && (
        <div className="flex items-center gap-2">
          {isUnsaved() && !error && (
            <span className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
              <MessageCircleWarning className="h-3 w-3" strokeWidth={2.5} />
              Unsaved · Ctrl/Cmd+S
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400 border border-red-500/20">
              <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
              {error}
            </span>
          )}
        </div>
      )}

      {/* ── Tabs + Editor ── */}
      <div
        className="flex flex-col rounded-lg border border-white/8 bg-[#0a1628]/60 overflow-hidden"
        style={{ minHeight: 240 }}
      >
        <div className="flex items-center border-b border-white/5 bg-[#0e1f35]/50 px-1 pt-1 shrink-0">
          {(["body", "headers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-2 text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors"
              style={{
                color: activeTab === tab ? "#00e5cc" : "rgba(255,255,255,0.25)",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-3 right-3 h-px bg-cyan-400" />
              )}
            </button>
          ))}
        </div>

        <textarea
          key={activeTab}
          className="flex-1 w-full resize-none bg-transparent p-4 text-sm text-white/70 outline-none placeholder-white/15 leading-relaxed"
          style={{ minHeight: 200 }}
          spellCheck={false}
          value={activeTab === "body" ? formInput.body : formInput.headers}
          placeholder={
            activeTab === "body"
              ? '{\n  "key": "value"\n}'
              : '{\n  "Authorization": "Bearer ..."\n}'
          }
          onChange={(e) => {
            const val = e.target.value;
            const { error: jsonErr } = formatJson(val);
            setError(jsonErr);
            setFormInput({ ...formInput, [activeTab]: val });
          }}
        />
      </div>

      {/* ── Response panel ── */}
      <div className="rounded-lg border border-white/8 bg-[#0a1628]/60 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/5 bg-[#0e1f35]/50 px-4 py-2">
          <span className="text-[9px] tracking-[0.25em] uppercase text-white/25">
            Response
          </span>
          {proxyResponse?.status != null && (
            <span
              className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border"
              style={{
                background: statusOk
                  ? "rgba(74,222,128,0.08)"
                  : statusWarn
                    ? "rgba(251,146,60,0.08)"
                    : "rgba(248,113,113,0.08)",
                borderColor: statusOk
                  ? "rgba(74,222,128,0.2)"
                  : statusWarn
                    ? "rgba(251,146,60,0.2)"
                    : "rgba(248,113,113,0.2)",
                color: statusOk
                  ? "#4ade80"
                  : statusWarn
                    ? "#fb923c"
                    : "#f87171",
              }}
            >
              {statusOk ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              {proxyResponse.status}{" "}
              {proxyResponse.statusText}
            </span>
          )}
        </div>

        {proxyResponse ? (
          <pre className="max-h-full overflow-auto p-4 text-xs text-white/60 leading-relaxed whitespace-pre-wrap wrap-words">
            {proxyResponse.error ? (
              <span className="text-red-400">{proxyResponse.error}</span>
            ) : (
              <SyntaxHighlighter data={proxyResponse.data} />
            )}
          </pre>
        ) : (
          <div className="flex items-center justify-center py-8 gap-2 text-white/15">
            <Send size={14} />
            <span className="text-[10px] tracking-[0.2em] uppercase">
              Send a request to see the response
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
