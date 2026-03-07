import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { TPostBoxCollections, TPostBoxSelectorSelection } from "@/types";
import { createPortal } from "react-dom";
import {
  isAlreadyExists,
  renameCollectionName,
  renameCurlName,
} from "@/utils/postboxCollectionModifier";

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
      return setError(`${type} with name ${value} already exists`);

    if (type === "collection") {
      const collectionName = value.trim();
      setCollections((prev) =>
        renameCollectionName(prev, currentName, collectionName),
      );
      setSelection((prev) => {
        return { ...prev, collectionName };
      });
    } else if (type === "route") {
      const curlName = value.trim();
      setCollections((prev) =>
        renameCurlName(prev, currentName, collectionName ||"", curlName),
      );
      setSelection((prev) => {
        return { ...prev, curlName };
      });
    }
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-200 hover:text-cyan-700 transition-colors w-full text-left cursor-pointer"
      >
        <Pencil size={14} />
        <span>Rename</span>
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
                Rename {type}
              </h2>

              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : (
                <p className="text-xs text-gray-400">
                  Renaming{" "}
                  <span className="font-mono text-gray-600">{currentName}</span>{" "}
                  to
                </p>
              )}

              <input
                autoFocus
                className="w-full border-b-2 border-cyan-400 outline-none py-1 font-mono text-sm text-gray-800"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setOpen(false);
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 text-sm rounded-lg border hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  className="px-4 py-1.5 text-sm rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
