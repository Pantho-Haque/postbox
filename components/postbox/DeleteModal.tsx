import { Trash2 } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TPostBoxCollections, TPostBoxSelectorSelection } from "@/types";
import { createPortal } from "react-dom";
import {
  deleteCollectionName,
  deleteCurlName,
} from "@/utils/postboxCollectionModifier";

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
      setCollections((prev) => {
        return deleteCollectionName(prev, currentName);
      });
      setSelection(() => {
        return {
          collectionName: "",
          curlName: "",
        };
      });
    } else if (type === "route") {
      setCollections((prev) => {
        return deleteCurlName(prev, collectionName || "", currentName);
      });
      setSelection((prev) => {
        return {
          ...prev,
          curlName: "",
        };
      });
    }
    setOpen(false);
  }, [type, currentName, collectionName, setCollections, setSelection]);

  useEffect(() => {
    if (!open) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Enter") handleDelete();
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open, handleDelete]);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-200 hover:text-cyan-700 transition-colors w-full text-left cursor-pointer"
      >
        <Trash2 size={14} />
        <span>Delete</span>
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-6 w-[360px] flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-600">
                Delete {type}
              </h2>
              <p className="text-xs text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-mono text-gray-600">{currentName}</span>
                {" ?"}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 text-sm rounded-lg border hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-1.5 text-sm rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
