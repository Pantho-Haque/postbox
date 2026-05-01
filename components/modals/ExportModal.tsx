"use client";

import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { ModalShell, ModalActions } from "@/components";
import { compressString } from "@/utils/compressString";
import { THittableCurl } from "@/types";

export default function ExportModal({
  exportString,
  collectionName,
}: {
  exportString: string;
  collectionName: string;
}) {
  const [open, setOpen] = useState(false);

  const compressed = useCallback(() => {
    const parsed = JSON.parse(exportString);
    const stripped = {
      ...parsed,
      curls: parsed.curls?.map((c: THittableCurl) => ({ ...c, response: "" })),
    };
    return compressString(JSON.stringify(stripped));
  }, [exportString]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(compressed());
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-cyan-400 transition-colors w-full text-left cursor-pointer"
      >
        <Upload size={12} />
        Export
      </button>

      {open && (
        <ModalShell
          title={`Export`}
          subtitle={`Copy this code to Import ${collectionName} anytime`}
          onClose={() => setOpen(false)}
        >
          <div className="w-full h-full overflow-scroll">
            <p className="text-xs text-white/50">{compressed()}</p>
          </div>
          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={copyToClipboard}
            confirmLabel="Copy"
          />
        </ModalShell>
      )}
    </>
  );
}
