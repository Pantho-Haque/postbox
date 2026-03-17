"use client";

import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  TPostBoxCollections,
  TPostBoxSelectorSelection,
} from "@/types";
import {
  isAlreadyExists,
  renameCollectionName,
  renameCurlName,
} from "@/utils/postboxCollectionModifier";
import { ModalInput, ModalShell, ModalActions } from "@/components";


export default function RenameModal({
  currentName,
  type,
  collectionCurlList,
  collectionName,
  setCollections,
  setSelection,
}: {
  currentName: string;
  type: "collection" | "route";
  collectionCurlList: { [key: string]: string[] };
  collectionName?: string;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelection: Dispatch<SetStateAction<TPostBoxSelectorSelection>>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentName);
  const [error, setError] = useState("");

  const handleRename = () => {
    if (!value.trim() || value === currentName) return setOpen(false);
    if (isAlreadyExists(collectionCurlList, type, value, collectionName))
      return setError(`"${value}" already exists`);

    if (type === "collection") {
      setCollections((prev) => renameCollectionName(prev, currentName, value.trim()));
      setSelection((prev) => ({ ...prev, collectionName: value.trim() }));
    } else {
      setCollections((prev) => renameCurlName(prev, currentName, collectionName ?? "", value.trim()));
      setSelection((prev) => ({ ...prev, curlName: value.trim() }));
    }
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setValue(currentName); setOpen(true); }}
        className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-cyan-400 transition-colors w-full text-left cursor-pointer"
      >
        <Pencil size={12} />
        Rename
      </button>

      {open && (
        <ModalShell
          title={`Rename ${type}`}
          subtitle={`Currently: ${currentName}`}
          onClose={() => setOpen(false)}
        >
          {error && <p className="text-[10px] text-red-400 -mt-2">{error}</p>}
          <ModalInput
            autoFocus
            value={value}
            onChange={(v) => { setValue(v); setError(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") setOpen(false);
            }}
          />
          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={handleRename}
            confirmLabel="Rename"
          />
        </ModalShell>
      )}
    </>
  );
}