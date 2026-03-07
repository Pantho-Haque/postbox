import { POSTBOX_METHODS } from "@/constants";
import { TPostBoxCollections, TPostBoxCurlJson, TPostBoxEnv } from "@/types";
import { curlConverter, jsonToCurl } from "@/utils/curlConverter";
import { formatJson } from "@/utils/formatJson";
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
  selectedCurlJson,
  envs,
  setSelectedCurlJson,
  setProxyResponse,
  setCollections,
}: {
  selectedCurlJson: TPostBoxCurlJson;
  envs: TPostBoxEnv;
  setSelectedCurlJson: (curl: TPostBoxCurlJson) => void;
  setProxyResponse: (response: unknown) => void;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
}) {
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");
  const [rawBody, setRawBody] = useState(
    formatJson(selectedCurlJson.body).output,
  );
  const [rawHeaders, setRawHeaders] = useState(
    formatJson(selectedCurlJson.headers).output,
  );

  const [proxyLoading, setProxyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedJson, setCachedJson] = useState(
    JSON.stringify(selectedCurlJson),
  );

  useEffect(() => {
    setCachedJson(JSON.stringify(selectedCurlJson));
  }, [selectedCurlJson.collectionName, selectedCurlJson.curlName]);

  function resolveEnv(text: string): string {
    if (!envs) return text;
    return text.replace(
      /\<\<(\w+)\>\>/g,
      (_, key) => envs[key] ?? `<<${key}>>`,
    );
  }

  const sendProxyRequest = useCallback(async () => {
    setProxyLoading(true);
    setProxyResponse(null);
    try {
      const res = await postboxProxy(
        resolveEnv(selectedCurlJson.url),
        selectedCurlJson.method,
        resolveEnv(selectedCurlJson.headers),
        resolveEnv(selectedCurlJson.body),
      );
      setProxyResponse(res);
    } catch (err) {
      console.log(err);
      setProxyResponse({ error: String(err) });
    } finally {
      setProxyLoading(false);
    }
  }, [selectedCurlJson, envs]);

  const formatting = (text: string, type: "body" | "headers") => {
    const { output, error } = formatJson(text);
    if (error) {
      setError(error);
      return;
    }
    setError(null);
    if (type === "body") {
      setRawBody(output);
      setSelectedCurlJson({ ...selectedCurlJson, body: output });
    } else if (type === "headers") {
      setRawHeaders(output);
      setSelectedCurlJson({ ...selectedCurlJson, headers: output });
    }
  };

  const isUnsaved = useCallback(() => {
    return cachedJson !== JSON.stringify(selectedCurlJson);
  }, [cachedJson, selectedCurlJson]);

  const handleUrlInputChange = (url: string) => {
    if (url.startsWith("curl")) {
      const collectionName = selectedCurlJson.collectionName;
      const curlName = selectedCurlJson.curlName;
      setSelectedCurlJson({
        ...curlConverter(undefined, curlName, url),
        collectionName,
      });
    } else {
      setSelectedCurlJson({ ...selectedCurlJson, url });
    }
  };
  const handleSaveCollection = () => {
    setCachedJson(JSON.stringify(selectedCurlJson));
    console.log(selectedCurlJson);
    setCollections((prev) =>
      updateCurl(
        prev,
        selectedCurlJson.collectionName,
        selectedCurlJson.curlName,
        jsonToCurl(selectedCurlJson),
      ),
    );
  };

  useEffect(() => {
    setRawBody(formatJson(selectedCurlJson.body).output);
    setRawHeaders(formatJson(selectedCurlJson.headers).output);
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
  }, [selectedCurlJson, sendProxyRequest]);

  return (
    <div className="h-full w-full">
      <div className="flex gap-2">
        <select
          className="w-[100px] p-2 bg-white border rounded-md cursor-pointer"
          value={selectedCurlJson.method}
          onChange={(e) =>
            setSelectedCurlJson({ ...selectedCurlJson, method: e.target.value })
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
          value={selectedCurlJson.url}
          onChange={(e) => {
            handleUrlInputChange(e.target.value);
          }}
        />
        <button
          className="w-[100px] p-2 border border-cyan-500 bg-white rounded-md cursor-pointer"
          onClick={() => sendProxyRequest()}
        >
          {proxyLoading ? <Loader2 className="animate-spin" /> : "Send"}
        </button>
        {/* <button
          className="w-[100px] p-2 border border-cyan-500 bg-white rounded-md cursor-pointer"
          onClick={() => handleSaveCollection()}
        >
          Save
        </button> */}
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
              value={rawBody}
              onChange={(e) => {
                formatting(e.target.value, "body");
                setRawBody(e.target.value);
              }}
            />
          ) : (
            <textarea
              className="w-full h-[300px] p-6 bg-white border-2 border-gray-50 rounded-2xl font-mono text-sm text-gray-700 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
              value={rawHeaders}
              onChange={(e) => {
                formatting(e.target.value, "headers");
                setRawHeaders(e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
