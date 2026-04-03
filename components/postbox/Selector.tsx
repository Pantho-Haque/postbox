"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Package2, Route, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateModal, EnvModal, Menu } from "@/components";
import { curlConverter } from "@/utils/curlConverter";
import {
  TPostBoxCollections,
  TPostBoxSelectorResponse,
  TPostBoxSelectorSelection,
} from "@/types";
import { parseStringToJson } from "@/utils/JsonStringParsing";
import { useRouter, useSearchParams } from "next/navigation";

function EmptyState({
  icon: Icon,
  label,
}: {
  icon: typeof Package2;
  label: string;
}) {
  return (
    <div className="px-3 py-6 text-center">
      <Icon size={18} className="text-white/10 mx-auto mb-2" />
      <p className="text-[10px] text-white/20 leading-relaxed">{label}</p>
    </div>
  );
}

function PanelItem({
  name,
  isActive,
  onClick,
  menuSlot,
}: {
  name: string;
  isActive: boolean;
  onClick: () => void;
  menuSlot: React.ReactNode;
}) {
  return (
    <div
      title={name}
      className={`group/menu relative flex items-center justify-between mx-2 mb-0.5 rounded-md overflow-visible transition-all cursor-pointer
        ${
          isActive
            ? "bg-cyan-500/10 border border-cyan-500/20"
            : "border border-transparent hover:bg-white/4 hover:border-white/5"
        }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />
      )}
      <div
        className="flex-1 pl-3 pr-1 py-2.5 truncate text-xs font-semibold capitalize"
        style={{ color: isActive ? "#00e5cc" : "rgba(255,255,255,0.5)" }}
        onClick={onClick}
      >
        {name}
      </div>
      {menuSlot}
    </div>
  );
}

export default function Selector({
  collections,
  setCollections,
  setSelectorResponse,
}: {
  collections: TPostBoxCollections;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectorResponse: Dispatch<
    SetStateAction<TPostBoxSelectorResponse | null>
  >;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const collectionCurlList = collections.reduce(
    (acc, c) => {
      acc[c.collectionName] = c.curls.map((curl) => curl.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const [hideSidebar, setHideSidebar] = useState(false);
  const [selection, setSelection] = useState<TPostBoxSelectorSelection>({
    collectionName: searchParams.get("c") ?? "",
    curlName: searchParams.get("r") ?? collectionCurlList[searchParams.get("c") ?? ""]?.[0] ?? "",
  });

  const handleSelect = (collectionName: string, curlName: string) => {
    setSelection({ collectionName, curlName });
    router.push(`/postbox?c=${encodeURIComponent(collectionName)}&r=${encodeURIComponent(curlName)}`);
  };


  useEffect(() => {
    if (!selection.curlName) return setSelectorResponse(null);

    const collection = collections.find(
      (c) => c.collectionName === selection.collectionName,
    );
    const curl = collection?.curls.find((c) => c.name === selection.curlName);

    router.push(`/postbox?c=${encodeURIComponent(selection.collectionName)}&r=${encodeURIComponent(selection.curlName)}`);
    setSelectorResponse({
      collectionName: selection.collectionName,
      curlName: selection.curlName,
      env: collection?.env,
      curlJson: curlConverter(curl?.curl || ""),
      responseJson: parseStringToJson(curl?.response || ""),
    });
  }, [selection, collections, setSelectorResponse,router]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setHideSidebar(true);
      }
      if (e.key === "ArrowRight") {
        setHideSidebar(false);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  

  const collectionsPanel = (
    <div
      className={`h-full flex flex-col bg-[#0a1628]/80 border-r border-white/5 overflow-visible transition-all duration-200 ${hideSidebar ? "w-[40px]" : "w-[160px]"}`}
    >
      {/* Header */}
      <div className="px-3 pt-4 pb-3 border-b border-white/5 flex items-center justify-between gap-2">
        {!hideSidebar && (
          <p className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/50">
            Collections
          </p>
        )}
        <button
          onClick={() => setHideSidebar((prev) => !prev)}
          className="ml-auto text-white/30 hover:text-cyan-400 transition-colors"
        >
          {hideSidebar ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Body — hidden when collapsed */}
      {!hideSidebar && (
        <>
          <div className="px-3 pt-3 pb-2 border-b border-white/5">
            <CreateModal
              type="collection"
              selection={selection}
              setSelection={setSelection}
              setCollections={setCollections}
              setSelectorResponse={setSelectorResponse}
              collectionCurlList={collectionCurlList}
            />
          </div>

          <div className="flex-1 py-2 overflow-visible">
            {Object.keys(collectionCurlList).length === 0 ? (
              <EmptyState icon={Package2} label="No collections" />
            ) : (
              Object.entries(collectionCurlList).map(
                ([collectionName, curlList], i) => (
                  <PanelItem
                    key={i}
                    name={collectionName}
                    isActive={selection.collectionName === collectionName}
                    onClick={() =>
                      handleSelect(collectionName, curlList[0] ?? "")
                    }
                    menuSlot={
                      <Menu
                        type="collection"
                        collectionCurlList={collectionCurlList}
                        currentName={collectionName}
                        exportString={JSON.stringify(collections.find((el) => el.collectionName === collectionName))}
                        setCollections={setCollections}
                        setSelection={setSelection}
                      />
                    }
                  />
                ),
              )
            )}
          </div>
        </>
      )}
    </div>
  );

  const routesPanel = selection.collectionName && !hideSidebar && (
    <div className="h-full w-[160px] flex flex-col bg-[#0c1a2e]/60 overflow-visible">
      {/* Header */}
      <div className="px-3 pt-4 pb-3 border-b border-white/5">
        <p className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/50 mb-2">
          Routes
        </p>
        <div className="flex flex-col gap-1.5">
          <EnvModal
            envs={
              collections.find(
                (el) => el.collectionName === selection.collectionName,
              )?.env ?? {}
            }
            collectionName={selection.collectionName}
            setCollections={setCollections}
            setSelectorResponse={setSelectorResponse}
          />
          <CreateModal
            type="route"
            selection={selection}
            setSelection={setSelection}
            setCollections={setCollections}
            setSelectorResponse={setSelectorResponse}
            collectionCurlList={collectionCurlList}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 py-2 overflow-y-auto">
        {collectionCurlList[selection.collectionName]?.length === 0 ? (
          <EmptyState icon={Route} label="No routes yet" />
        ) : (
          collectionCurlList[selection.collectionName]?.map((curl, i) => (
            <PanelItem
              key={i}
              name={curl}
              isActive={selection.curlName === curl}
              onClick={() => handleSelect(selection.collectionName, curl)}
              menuSlot={
                <Menu
                  type="route"
                  collectionCurlList={collectionCurlList}
                  currentName={curl}
                  collectionName={selection.collectionName}
                  setCollections={setCollections}
                  setSelection={setSelection}
                />
              }
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex shrink-0 border-r border-white/5">
      {collectionsPanel}
      {routesPanel}
    </div>
  );
}