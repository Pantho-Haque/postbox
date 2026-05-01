"use client";

import { Import } from "lucide-react";
import { useState } from "react";
import { ModalShell, ModalActions } from "@/components";
import { decompressString } from "@/utils/compressString";
import { THittableCollection } from "@/types";
import { useDataContext } from "@/context/dataContext";

export default function ImportModal() {

  const { collections, setCollections } = useDataContext();
  
  const [open, setOpen] = useState(false);
  const [compressedString, setCompressedString] = useState("");

  const importCollection = () => {
    const decompressed = decompressString(compressedString);
    const parsed = JSON.parse(decompressed) as THittableCollection;
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
        className="modal-button-mini mt-2"
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
