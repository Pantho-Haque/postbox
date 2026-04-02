"use client";
import { useEffect, useState } from "react";
import { RequestForm, Selector } from "@/components";
import { TPostBoxCollections, TPostBoxSelectorResponse } from "@/types";
import { GetPostboxCollections } from "@/services/Postbox";

export default function Postbox() {
  const [collections, setCollections] = useState<TPostBoxCollections>(
    GetPostboxCollections(),
  );
  const [selectorResponse, setSelectorResponse] =
    useState<TPostBoxSelectorResponse | null>(null);

  useEffect(() => {
    localStorage.setItem("postbox", JSON.stringify(collections));
  }, [collections]);

  return (
    <div className="h-[calc(100vh-44px)] w-full flex bg-[#080f1a] overflow-hidden font-mono">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-400/4 blur-[100px]" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <Selector
          collections={collections}
          setCollections={setCollections}
          setSelectorResponse={setSelectorResponse}
        />

        <div className="flex-1 h-full overflow-hidden">
          {selectorResponse ? (
            <div className="h-full w-full flex flex-col overflow-auto p-6">
              <RequestForm
                selectorResponse={selectorResponse}
                setCollections={setCollections}
                setSelectorResponse={setSelectorResponse}
              />
            </div>
          ) : (
            <EmptyState hasCollections={collections.length > 0} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasCollections }: { hasCollections: boolean }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-6 text-center px-8">
        {/* Corner brackets */}
        <span className="absolute -top-6 -left-6 w-6 h-6 border-t-2 border-l-2 border-cyan-500/40" />
        <span className="absolute -top-6 -right-6 w-6 h-6 border-t-2 border-r-2 border-cyan-500/40" />
        <span className="absolute -bottom-6 -left-6 w-6 h-6 border-b-2 border-l-2 border-cyan-500/40" />
        <span className="absolute -bottom-6 -right-6 w-6 h-6 border-b-2 border-r-2 border-cyan-500/40" />

        <div className="w-16 h-16 rounded-full border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
            <path d="M12 12h.01"/>
            <path d="M8 12h.01"/>
            <path d="M16 12h.01"/>
          </svg>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-500/60 mb-2">Postbox</p>
          <h2 className="text-xl font-bold text-white/80 mb-2">
            {hasCollections ? "Select a route" : "No collections yet"}
          </h2>
          <p className="text-xs text-white/30 max-w-[260px] leading-relaxed">
            {hasCollections
              ? "Choose a collection and route from the sidebar to start making requests."
              : "Create a collection in the sidebar, then add routes to start testing your APIs."}
          </p>
        </div>
      </div>
    </div>
  );
}
