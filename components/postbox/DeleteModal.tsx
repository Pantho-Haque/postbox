import { Trash2 } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TPostBoxCollections, TPostBoxSelectorSelection } from "@/types";
import {
  deleteCollectionName,
  deleteCurlName,
} from "@/utils/postboxCollectionModifier";
import { ModalActions, ModalShell } from "@/components";

export default function DeleteModal({
  currentName,
  type,
  collectionName,
  setCollections,
  setSelection,
}: {
  currentName: string;
  type: "collection" | "route";
  collectionName?: string;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelection: Dispatch<SetStateAction<TPostBoxSelectorSelection>>;
}) {
  const [open, setOpen] = useState(false);

  const handleDelete = useCallback(() => {
    if (type === "collection") {
      setCollections((prev) => deleteCollectionName(prev, currentName));
      setSelection({ collectionName: "", curlName: "" });
    } else {
      setCollections((prev) =>
        deleteCurlName(prev, collectionName ?? "", currentName),
      );
      setSelection((prev) => ({ ...prev, curlName: "" }));
    }
    setOpen(false);
  }, [type, currentName, collectionName, setCollections, setSelection]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Enter") handleDelete();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleDelete]);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:bg-red-500/8 hover:text-red-400 transition-colors w-full text-left cursor-pointer"
      >
        <Trash2 size={12} />
        Delete
      </button>

      {open && (
        <ModalShell
          title={`Delete ${type}`}
          subtitle={`This will permanently remove "${currentName}"${type === "collection" ? " and all its routes" : ""}.`}
          onClose={() => setOpen(false)}
        >
          <div className="rounded-md border border-red-500/20 bg-red-500/8 px-3 py-2">
            <p className="text-xs text-red-400/80 font-mono">{currentName}</p>
          </div>
          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={handleDelete}
            confirmLabel="Delete"
            confirmDanger
          />
        </ModalShell>
      )}
    </>
  );
}
