"use client";

import { Import } from "lucide-react";
import { useState } from "react";
import { ModalShell, ModalActions } from "@/components";
import { decompressString } from "@/utils/compressString";
import { TPostBoxCollection, TPostBoxCollections } from "@/types";
import { Dispatch, SetStateAction } from "react";

export default function ImportModal({
  collections,
  setCollections,
}: {
  collections: TPostBoxCollections;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
}) {
  const [open, setOpen] = useState(false);
  const [compressedString, setCompressedString] = useState("");

  const importCollection = () => {
    const decompressed = decompressString(compressedString);
    const parsed = JSON.parse(decompressed) as TPostBoxCollection;
    let importedCollectionName = parsed.collectionName;
    importedCollectionName = collections.map((collection) => collection.collectionName).includes(importedCollectionName) 
        ? `${importedCollectionName} - New` 
        : importedCollectionName;
    setCollections((prev) => [...prev, {...parsed, collectionName: importedCollectionName}]);
    setOpen(false);
    setCompressedString("");
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="text-white/30 hover:text-cyan-400 transition-colors p-2 border border-white/5 hover:border-cyan-500/20 cursor-pointer rounded-full mt-2"
      >
        <Import size={14} />
      </button>

      {open && (
        <ModalShell
          title={`Import`}
          subtitle={`Paste the code here to add to collections`}
          onClose={() => setOpen(false)}
        >
          <div className="w-full h-full">
            <textarea
              value={compressedString}
              onChange={(e) => setCompressedString(e.target.value)}
              className="w-full h-full bg-transparent border border-white/10 rounded-lg p-2 text-xs text-white/50 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>
          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={importCollection}
            confirmLabel="Import"
          />
        </ModalShell>
      )}
    </>
  );
}
