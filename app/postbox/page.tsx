"use client";
import { useEffect, useState } from "react";
import { RequestForm, Selector } from "@/components";
import { TPostBoxCurlJson, TPostBoxCollections, TPostBoxEnv } from "@/types";
import { curlConverter } from "@/utils/curlConverter";

export default function Postbox() {
  const [collections, setCollections] = useState<TPostBoxCollections>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("postbox");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedCurlJson, setSelectedCurlJson] = useState<TPostBoxCurlJson>({
    ...curlConverter(collections[0], collections[0]?.curls[0]?.name),
  });
  const [envs, setEnvs] = useState<TPostBoxEnv>(collections[0]?.env);

  const [proxyResponse, setProxyResponse] = useState<unknown>(null);

  useEffect(() => {
    console.log(collections);
    localStorage.setItem("postbox", JSON.stringify(collections));
  }, [collections]);

  return (
    <div className="h-full w-full flex ">
      <Selector
        collections={collections}
        envs={envs}
        setEnvs={setEnvs}
        setCollections={setCollections}
        setSelectedCurlJson={setSelectedCurlJson}
      />
      <div className="h-full w-full pt-4 flex flex-col gap-2 px-2 bg-gray-50">
        <RequestForm
          selectedCurlJson={selectedCurlJson}
          envs={envs}
          setSelectedCurlJson={setSelectedCurlJson}
          setProxyResponse={setProxyResponse}
          setCollections={setCollections}
        />

        <div className="h-full w-full border rounded-md">
          <textarea
            readOnly
            disabled={!!proxyResponse}
            value={
              proxyResponse ? JSON.stringify(proxyResponse, null, "\t") : ""
            }
            className="w-full h-full p-6 bg-white border-2 border-gray-50 rounded-2xl font-mono text-sm text-gray-700 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
            placeholder="The formatted JSON will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
