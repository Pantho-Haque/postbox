import { TResponseJson } from "@/types";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import SyntaxHighlighter from "../postbox/SyntaxHighlighter";

export default function ResponsePanel({
  proxyResponse,
}: {
  proxyResponse: TResponseJson | null;
}) {
  const statusOk = proxyResponse?.status != null && proxyResponse.status < 300;
  const statusWarn =
    proxyResponse?.status != null &&
    proxyResponse.status >= 300 &&
    proxyResponse.status < 500;
  return (
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
              color: statusOk ? "#4ade80" : statusWarn ? "#fb923c" : "#f87171",
            }}
          >
            {statusOk ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {proxyResponse.status} {proxyResponse.statusText}
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
  );
}
