import { POSTBOX_METHODS } from "@/constants";
import {
  TPostBoxCollections,
  TPostBoxCurlJson,
  TPostBoxEnv,
  TPostBoxSelectorResponse,
} from "@/types";
import { curlConverter, jsonToCurl } from "@/utils/curlConverter";
import { formatJson, formatWithErrorHandleing } from "@/utils/formatJson";
import { updateCurl } from "@/utils/postboxCollectionModifier";
import { postboxProxy } from "@/utils/postboxProxy";
import { AlertCircle, Loader2, MessageCircleWarning } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

export default function RequestForm({
  selectedResponse,
  setCollections,
  setSelectorResponse,
}: {
  selectedResponse: TPostBoxSelectorResponse;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectorResponse: Dispatch<
    SetStateAction<TPostBoxSelectorResponse | null>
  >;
}) {
  const { collectionName, curlName, env, curlJson } = selectedResponse;

  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");
  const [error, setError] = useState<string | null>(null);

  const [formInput, setFormInput] = useState<TPostBoxCurlJson>({
    ...curlJson,
    body: formatJson(curlJson.body).output,
    headers: formatJson(curlJson.headers).output,
  });

  useEffect(() => {
    const reload = () => {
      setFormInput({
        ...curlJson,
        body: formatJson(curlJson.body).output,
        headers: formatJson(curlJson.headers).output,
      });
    };
    reload();
  }, [curlJson]);

  const [proxyLoading, setProxyLoading] = useState(false);

  function resolveEnv(text: string, env?: TPostBoxEnv): string {
    if (!env) return text;
    return text.replace(/<<(\w+)>>/g, (_, key) => env[key] ?? `<<${key}>>`);
  }

  const [proxyResponse, setProxyResponse] = useState<{
    data?: unknown;
    status?: number;
    error?: string;
  } | null>(null);

  const sendProxyRequest = useCallback(async () => {
    setProxyLoading(true);
    setProxyResponse(null);
    try {
      const res = await postboxProxy(
        resolveEnv(formInput.url, env),
        formInput.method,
        resolveEnv(formInput.headers, env),
        resolveEnv(formInput.body, env),
      );
      setProxyResponse(res);
    } catch (err) {
      setProxyResponse({ error: String(err) });
    } finally {
      setProxyLoading(false);
    }
  }, [formInput, env]);

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
      normalize(formInput.headers) !== normalize(curlJson.headers)
    );
  }, [formInput, curlJson]);

  const handleSaveCollection = useCallback(() => {
    setSelectorResponse({
      collectionName,
      curlName,
      env,
      curlJson: formInput,
    });
    setCollections((prev) =>
      updateCurl(prev, collectionName, curlName, jsonToCurl(formInput)),
    );
  }, [
    formInput,
    collectionName,
    curlName,
    env,
    setSelectorResponse,
    setCollections,
  ]);

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

  return (
    <div className="h-full w-full">
      <div className="flex gap-2">
        <select
          className="w-[100px] p-2 bg-white border rounded-md cursor-pointer"
          value={formInput.method}
          onChange={(e) =>
            setFormInput({ ...formInput, method: e.target.value })
          }
        >
          {POSTBOX_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          value={formInput.url}
          onChange={(e) => {
            setFormInput({ ...formInput, url: e.target.value });
          }}
        />
        <button
          className="w-[100px] p-2 border border-cyan-500 bg-white rounded-md cursor-pointer"
          onClick={() => sendProxyRequest()}
        >
          {proxyLoading ? <Loader2 className="animate-spin" /> : "Send"}
        </button>
      </div>
      <div className="">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 ${activeTab === "body" ? "border-b-4 border-cyan-500" : ""} cursor-pointer`}
            onClick={() => setActiveTab("body")}
          >
            Body
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "headers" ? "border-b-4 border-cyan-500" : ""} cursor-pointer`}
            onClick={() => setActiveTab("headers")}
          >
            Headers
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                  Syntax Error
                </span>
                <span className="text-xs font-bold text-red-900 leading-tight">
                  {error}
                </span>
              </div>
            </div>
          )}

          {isUnsaved() && (
            <div className="mt-2 ml-auto mr-4 px-4 py-1 bg-red-50 flex items-center justify-center animate-in fade-in slide-in-from-top-1">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <MessageCircleWarning
                    className="w-3 h-3 text-red-500"
                    strokeWidth={3}
                  />
                  <span className="text-xs font-bold text-red-900 leading-tight">
                    Unsaved
                  </span>
                </div>
                <p className="text-[10px] font-bold text-red-900 leading-tight">
                  (Ctrl/Cmd + S)
                </p>
              </div>
              <button
                className="px-2 py-0.5 ml-1 text-xs font-bold border border-cyan-500 bg-white rounded-md cursor-pointer"
                onClick={() => handleSaveCollection()}
              >
                Save
              </button>
            </div>
          )}
        </div>
        <div className="h-full w-full pt-1">
          {activeTab === "body" ? (
            <textarea
              className="w-full h-[300px] p-6 bg-white border-2 border-gray-50 rounded-2xl font-mono text-sm text-gray-700 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
              value={formInput.body}
              onChange={(e) => {
                setFormInput({
                  ...formInput,
                  body: formatWithErrorHandleing(e.target.value, setError),
                });
              }}
            />
          ) : (
            <textarea
              className="w-full h-[300px] p-6 bg-white border-2 border-gray-50 rounded-2xl font-mono text-sm text-gray-700 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
              value={formInput.headers}
              onChange={(e) => {
                setFormInput({
                  ...formInput,
                  headers: formatWithErrorHandleing(e.target.value, setError),
                });
              }}
            />
          )}
        </div>
      </div>
      <textarea
        readOnly
        value={proxyResponse ? JSON.stringify(proxyResponse, null, "\t") : ""}
        className="w-full h-full p-6 bg-white border-2 border-gray-50 rounded-2xl font-mono text-sm text-gray-700 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
        placeholder="The formatted JSON will appear here..."
      />
    </div>
  );
}
