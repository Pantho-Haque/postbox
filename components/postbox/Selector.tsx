import { Dispatch, SetStateAction, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { EllipsisVertical, Package2, Route } from "lucide-react";
import { CreateModal, DeleteModal, EnvModal, RenameModal } from "@/components";
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

const Menu = ({
  type,
  collectionCurlList,
  currentName,
  collectionName,
  setCollections,
  setSelection,
}: {
  type: "collection" | "route";
  collectionCurlList: { [key: string]: string[] };
  currentName: string;
  collectionName?: string;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelection: Dispatch<SetStateAction<TPostBoxSelectorSelection>>;
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 8 });
    }
  }, []);

  const handleOpen = useCallback(() => {
    updatePos();
    setOpen(true);
  }, [updatePos]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    <div className="hidden group-hover/menu:flex items-center justify-center shrink-0 pr-1">
      <div
        ref={triggerRef}
        onClick={handleOpen}
        className="p-1 rounded text-white/20 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
      >
        <EllipsisVertical size={14} />
      </div>
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-999"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="flex flex-col min-w-[130px] bg-[#0e1f35] border border-white/10 shadow-2xl shadow-black/60 rounded-lg backdrop-blur-md">
              <RenameModal
                currentName={currentName}
                type={type}
                collectionCurlList={collectionCurlList}
                collectionName={collectionName}
                setCollections={setCollections}
                setSelection={setSelection}
              />
              <div className="h-px bg-white/5 mx-2" />
              <DeleteModal
                currentName={currentName}
                type={type}
                collectionName={collectionName}
                setCollections={setCollections}
                setSelection={setSelection}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

