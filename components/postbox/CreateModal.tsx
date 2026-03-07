import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  TPostBoxCollections,
  TPostBoxSelectorResponse,
  TPostBoxSelectorSelection,
} from "@/types";
import { createPortal } from "react-dom";
import {
  createCollectionName,
  createCurlName,
  isAlreadyExists,
} from "@/utils/postboxCollectionModifier";

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
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!value.trim()) return setOpen(false);

    if (
      isAlreadyExists(collectionCurlList, type, value, selection.collectionName)
    )
      return setError(`${type} with name ${value} already exists`);

    if (type === "collection") {
      const collectionName = value.trim();
      setCollections((prev) => createCollectionName(prev, collectionName));
      setSelection({
        collectionName,
        curlName: "",
      });
      setSelectorResponse(()=> null);
    } else if (type === "route") {
      const curlName = value.trim();
      setCollections((prev) =>
        createCurlName(prev, selection.collectionName, curlName),
      );
      setSelection({
        collectionName: selection.collectionName,
        curlName,
      });
    }
    setValue("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="mx-1 p-1 py-2 flex items-center gap-1 text-sm font-semibold bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
      >
        <Plus size={18} />
        Create <span className="capitalize">{type}</span>
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
                Create <span className="capitalize">{type}</span>
              </h2>

              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : (
                <p className="text-xs text-gray-400 capitalize">
                  Create a new <span className="capitalize">{type}</span>
                  {type == "route" && (
                    <span> on {selection.collectionName}</span>
                  )}
                </p>
              )}

              <input
                autoFocus
                className="w-full border-b-2 border-cyan-400 outline-none py-1 font-mono text-sm text-gray-800"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
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
                  onClick={handleCreate}
                  className="px-4 py-1.5 text-sm rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
                >
                  Create
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
