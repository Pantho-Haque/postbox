"use client";

import { Plug, PlugZap } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalShell, ModalActions, ModalInput } from "@/components";
import { DisconnectLocalConnection, EstablishLocalConnection, getToken, startConnectionWatch } from "@/services";

export default function LocalConnectionModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => getToken() || "");
  const [connected, setConnected] = useState(() => !!token);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await EstablishLocalConnection(token);
      if (data.error) return setError(data.error);
      if (data.success) {
        setConnected(true);
        setOpen(false);
      }
    } catch {
      setError("Could not reach companion — is it running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    DisconnectLocalConnection()
    setConnected(false);
    setToken("");
    setOpen(false);
  };

  useEffect(() => {
  if (!connected) return;

  const stop = startConnectionWatch(() => {
    setConnected(false);
    setToken("");
    DisconnectLocalConnection();
  });

  return stop; // stops polling on unmount or disconnect
}, [connected]);

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors border w-full text-left cursor-pointer rounded-md
          ${connected
            ? "text-emerald-400 hover:bg-emerald-500/10"
            : "text-white/50 hover:bg-white/5 hover:text-cyan-400"
          }`}
      >
        {connected ? <PlugZap size={12} /> : <Plug size={12} />}
        {connected ? "Localhost Connected" : "Connect Localhost"}
        {connected && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>

      {open && (
        <ModalShell
          title="Connect to your localhost"
          subtitle={
            connected
              ? "Your localhost companion is connected and ready."
              : "Run 'npx postbox-companion' in your terminal and paste the token below."
          }
          onClose={() => setOpen(false)}
        >
          {/* Status badge */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-semibold
              ${connected
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-white/5 border-white/10 text-white/30"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connected ? "bg-emerald-400 animate-pulse" : "bg-white/20"
              }`}
            />
            {connected ? "Connected" : "Not connected"}
          </div>

          {!connected && (
            <>
              {error && (
                <p className="text-red-400 text-xs px-1">{error}</p>
              )}
              <ModalInput
                autoFocus
                placeholder="Paste token here..."
                value={token}
                onChange={(v) => { setToken(v); setError(""); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConnect();
                  if (e.key === "Escape") setOpen(false);
                }}
              />
            </>
          )}

          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={connected ? handleDisconnect : handleConnect}
            confirmLabel={connected ? "Disconnect" : "Connect"}
            confirmDanger={connected}
            loading={loading}
          />
        </ModalShell>
      )}
    </>
  );
}