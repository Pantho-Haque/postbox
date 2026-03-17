"use client";

import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { EllipsisVertical } from "lucide-react";
import { TPostBoxCollections, TPostBoxSelectorSelection } from "@/types";
import { DeleteModal, RenameModal } from "@/components";

export default function Menu({
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
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-modal]")) return;

      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="hidden group-hover/menu:flex items-center justify-center shrink-0 pr-1 relative"
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded text-white/20 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
      >
        <EllipsisVertical size={14} />
      </div>

      {open && (
        <div className="absolute left-full top-0 z-999">
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
        </div>
      )}
    </div>
  );
}
