"use client";

import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  TPostBoxCollections,
  TPostBoxSelectorResponse,
  TPostBoxSelectorSelection,
} from "@/types";
import {
  createCollectionName,
  createCurlName,
  isAlreadyExists,
} from "@/utils/postboxCollectionModifier";
import { ModalInput, ModalShell, ModalActions } from "@/components";

export default function CreateModal({
  type,
  selection,
  setSelection,
  setCollections,
  setSelectorResponse,
  collectionCurlList,
}: {
  type: "collection" | "route";
  selection: TPostBoxSelectorSelection;
  setSelection: (value: TPostBoxSelectorSelection) => void;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectorResponse: Dispatch<SetStateAction<TPostBoxSelectorResponse | null>>;
  collectionCurlList: { [key: string]: string[] };
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [curlString, setCurlString] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!value.trim()) return setOpen(false);
    if (isAlreadyExists(collectionCurlList, type, value, selection.collectionName))
      return setError(`"${value}" already exists`);

    if (type === "collection") {
      const name = value.trim();
      setCollections((prev) => createCollectionName(prev, name));
      setSelection({ collectionName: name, curlName: "" });
      setSelectorResponse(null);
    } else {
      const name = value.trim();
      setCollections((prev) =>
        createCurlName(prev, selection.collectionName, name, curlString),
      );
      setSelection({
        collectionName: selection.collectionName,
        curlName: name,
      });
    }
    setValue("");
    setCurlString("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold tracking-wider rounded-md border border-cyan-500/20 bg-cyan-500/8 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition-all cursor-pointer"
      >
        <Plus size={12} />
        New {type === "collection" ? "Collection" : "Route"}
      </button>

      {open && (
        <ModalShell
          title={`Create ${type}`}
          subtitle={
            type === "route"
              ? `Adding to ${selection.collectionName}`
              : "Start a new collection of routes"
          }
          onClose={() => setOpen(false)}
        >
          {error && <p className="text-[10px] text-red-400 -mt-2">{error}</p>}
          <ModalInput
            autoFocus
            value={value}
            onChange={(v) => {
              setValue(v);
              setError("");
            }}
            placeholder={type === "collection" ? "my-api" : "get-users"}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setOpen(false);
            }}
          />
          {type === "route" && (
            <textarea
              className="w-full h-24 p-2 text-xs  rounded-md bg-white/5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              value={curlString}
              onChange={(e) => {
                setCurlString(e.target.value);
                setError("");
              }}
              placeholder={"Paste you curl here"}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setOpen(false);
              }}
            />
          )}
          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={handleCreate}
            confirmLabel="Create"
          />
        </ModalShell>
      )}
    </>
  );
}