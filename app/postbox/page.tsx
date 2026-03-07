"use client";
import { useEffect, useState } from "react";
import { RequestForm, Selector } from "@/components";
import { TPostBoxCollections, TPostBoxSelectorResponse } from "@/types";
// import { curlConverter } from "@/utils/curlConverter";
import { GetPostboxCollections } from "@/services/Postbox";

export default function Postbox() {
  const [collections, setCollections] = useState<TPostBoxCollections>(
    GetPostboxCollections(),
  );
  const [selectorResponse, setSelectorResponse] =
    useState<TPostBoxSelectorResponse | null>(null);

  useEffect(() => {
    console.log("collections", collections);
    localStorage.setItem("postbox", JSON.stringify(collections));
  }, [collections]);

  // useEffect(() => {
  //   console.log("selectorResponse", selectorResponse);
  // }, [selectorResponse]);

  return (
    <div className="h-full w-full flex ">
      <Selector
        collections={collections}
        setCollections={setCollections}
        setSelectorResponse={setSelectorResponse}
      />
      {/* {selectorResponse && (
        <textarea
          readOnly
          value={
            selectorResponse ? JSON.stringify(selectorResponse, null, "\t") : ""
          }
          className="w-full h-[calc(100vh-4rem)] p-6 bg-white border-2 border-gray-50 rounded-2xl font-mono text-sm text-gray-700 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
          placeholder="The formatted JSON will appear here..."
        />
      )} */}
      {selectorResponse && (
        <div className="h-full w-full pt-4 flex flex-col gap-2 px-2 bg-gray-50">
          <RequestForm
            selectedResponse={selectorResponse}
            setCollections={setCollections}
            setSelectorResponse={setSelectorResponse}
          />
        </div>
      )}
    </div>
  );
}
