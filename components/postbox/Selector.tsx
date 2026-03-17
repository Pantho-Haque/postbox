import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Package2, Route } from "lucide-react";
import { CreateModal , EnvModal, Menu } from "@/components";
import { curlConverter } from "@/utils/curlConverter";
import {
  TPostBoxCollections,
  TPostBoxSelectorResponse,
  TPostBoxSelectorSelection,
} from "@/types";
import { parseStringToJson } from "@/utils/JsonStringParsing";

export default function Selector({
  collections,
  setCollections,
  setSelectorResponse,
}: {
  collections: TPostBoxCollections;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectorResponse: Dispatch<SetStateAction<TPostBoxSelectorResponse | null>>;
}) {
  const collectionCurlList = collections.reduce(
    (acc, c) => {
      acc[c.collectionName] = c.curls.map((curl) => curl.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const [selection, setSelection] = useState<TPostBoxSelectorSelection>({
    collectionName: "",
    curlName: "",
  });

  useEffect(() => {
    if (!!selection.curlName) {
      setSelectorResponse({
        collectionName: selection.collectionName,
        curlName: selection.curlName,
        env: collections.find((c) => c.collectionName === selection.collectionName)?.env,
        curlJson: curlConverter(
          collections
            .find((c) => c.collectionName === selection.collectionName)
            ?.curls.find((c) => c.name === selection.curlName)?.curl || "",
        ),
        responseJson: parseStringToJson(
          collections
            .find((c) => c.collectionName === selection.collectionName)
            ?.curls.find((c) => c.name === selection.curlName)?.response || "",
        )
      });
    } else {
      setSelectorResponse(null);
    }
  }, [selection, collections, setSelectorResponse]);

  return (
    <div className="h-full flex shrink-0 border-r border-white/5">
      {/* Collections panel */}
      <div className="h-full w-[160px] flex flex-col bg-[#0a1628]/80 border-r border-white/5 overflow-visible">
        {/* Header */}
        <div className="px-3 pt-4 pb-3 border-b border-white/5">
          <p className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/50 mb-2">Collections</p>
          <CreateModal
            type="collection"
            selection={selection}
            setSelection={setSelection}
            setCollections={setCollections}
            setSelectorResponse={setSelectorResponse}
            collectionCurlList={collectionCurlList}
          />
        </div>

        {/* Collection list */}
        <div className="flex-1 py-2 overflow-visible">
          {Object.keys(collectionCurlList).length === 0 ? (
            <div className="px-3 py-6 text-center">
              <Package2 size={18} className="text-white/10 mx-auto mb-2" />
              <p className="text-[10px] text-white/20 leading-relaxed">No collections</p>
            </div>
          ) : (
            Object.entries(collectionCurlList).map(([collectionName, curlList], i) => {
              const isActive = selection.collectionName === collectionName;
              return (
                <div
                  key={i}
                  title={collectionName}
                  className={`group/menu relative flex items-center justify-between mx-2 mb-0.5 rounded-md overflow-visible transition-all cursor-pointer
                    ${isActive
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
                    onClick={() => setSelection({ collectionName, curlName: curlList[0] ?? "" })}
                  >
                    {collectionName}
                  </div>
                  <Menu
                    type="collection"
                    collectionCurlList={collectionCurlList}
                    currentName={collectionName}
                    setCollections={setCollections}
                    setSelection={setSelection}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Routes panel */}
      {selection.collectionName && (
        <div className="h-full w-[160px] flex flex-col bg-[#0c1a2e]/60 overflow-visible">
          {/* Header */}
          <div className="px-3 pt-4 pb-3 border-b border-white/5">
            <p className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/50 mb-2">Routes</p>
            <div className="flex flex-col gap-1.5">
              <EnvModal
                envs={collections.find((el) => el.collectionName === selection.collectionName)?.[`env`] ?? {}}
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

          {/* Route list */}
          <div className="flex-1 py-2 overflow-y-auto">
            {collectionCurlList[selection.collectionName]?.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <Route size={18} className="text-white/10 mx-auto mb-2" />
                <p className="text-[10px] text-white/20 leading-relaxed">No routes yet</p>
              </div>
            ) : (
              collectionCurlList[selection.collectionName]?.map((curl, i) => {
                const isActive = selection.curlName === curl;
                return (
                  <div
                    key={i}
                    title={curl}
                    className={`group/menu relative flex items-center justify-between mx-2 mb-0.5 rounded-md overflow-visible transition-all cursor-pointer
                      ${isActive
                        ? "bg-cyan-500/10 border border-cyan-500/20"
                        : "border border-transparent hover:bg-white/4 hover:border-white/5"
                      }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />
                    )}
                    <div
                      className="flex-1 pl-3 pr-1 py-2.5 truncate text-xs capitalize"
                      style={{ color: isActive ? "#00e5cc" : "rgba(255,255,255,0.4)" }}
                      onClick={() => setSelection({ ...selection, curlName: curl })}
                    >
                      {curl}
                    </div>
                    <Menu
                      type="route"
                      collectionCurlList={collectionCurlList}
                      currentName={curl}
                      collectionName={selection.collectionName}
                      setCollections={setCollections}
                      setSelection={setSelection}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
