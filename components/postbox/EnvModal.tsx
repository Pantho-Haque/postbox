import { Plus, Trash2 } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  TPostBoxCollections,
  TPostBoxEnv,
  TPostBoxSelectorResponse,
} from "@/types";
import { createPortal } from "react-dom";
import { updateEnv } from "@/utils/postboxCollectionModifier";

export default function EnvModal({
  envs,
  collectionName,
  setSelectorResponse,
  setCollections,
}: {
  envs: TPostBoxEnv;
  collectionName: string;
  setSelectorResponse: Dispatch<
    SetStateAction<TPostBoxSelectorResponse | null>
  >;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
}) {
  const [open, setOpen] = useState(false);
  const [localEnv, setLocalEnv] = useState<[string, string][]>([]);

  const openModal = () => {
    setLocalEnv(Object.entries(envs) as [string, string][]);
    setOpen(true);
  };

  const handleChange = (index: number, field: "key" | "value", val: string) => {
    setLocalEnv((prev) =>
      prev.map((entry, i) =>
        i === index
          ? field === "key"
            ? [val, entry[1]]
            : [entry[0], val]
          : entry,
      ),
    );
  };

  const handleSave = useCallback(() => {
    const updatedEnv = Object.fromEntries(
      localEnv.filter(([k]) => k.trim()),
    ) as TPostBoxEnv;
    setCollections((prev) => updateEnv(prev, collectionName, updatedEnv));
    setSelectorResponse((prev) => {
      if (!prev || prev.collectionName !== collectionName) return prev;
      return {
        ...prev,
        env: updatedEnv,
      };
    });
    setOpen(false);
  }, [localEnv, collectionName, setCollections, setSelectorResponse]);

  useEffect(() => {
    if (!open) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open, handleSave]);

  return (
    <>
      <button
        onClick={openModal}
        className="py-1 px-3 flex items-center justify-center gap-1 text-sm text-cyan-600 font-semibold border border-cyan-400 hover:bg-cyan-700 hover:text-cyan-100 transition-colors rounded-full cursor-pointer"
      >
        <Plus size={18} />
        Manage Envs
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 w-[50%] max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm tracking-widest text-cyan-600">
                    Manage{" "}
                    <span className="font-bold uppercase">
                      {collectionName}
                    </span>{" "}
                    Envs
                  </h2>
                  <p className="text-xs text-gray-400">
                    use &lt;&lt;key&gt;&gt; to reference an env var
                  </p>
                </div>
                <button
                  onClick={() => setLocalEnv((prev) => [...prev, ["", ""]])}
                  className="flex items-center gap-1 text-xs text-cyan-600 border border-cyan-400 px-2 py-1 rounded-full hover:bg-cyan-50 cursor-pointer"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs text-gray-400 font-semibold uppercase px-1">
                  <span>Key</span>
                  <span>Value</span>
                  <span />
                </div>
                {localEnv.map(([key, value], i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                  >
                    <input
                      className="border-b-2 border-cyan-200 focus:border-cyan-400 outline-none py-1 px-1 font-mono text-sm text-gray-800"
                      placeholder="KEY"
                      value={key}
                      onChange={(e) => handleChange(i, "key", e.target.value)}
                    />
                    <input
                      className="border-b-2 border-cyan-200 focus:border-cyan-400 outline-none py-1 px-1 font-mono text-sm text-gray-800"
                      placeholder="value"
                      value={value}
                      onChange={(e) => handleChange(i, "value", e.target.value)}
                    />
                    <button
                      onClick={() =>
                        setLocalEnv((prev) =>
                          prev.filter((_, index) => index !== i),
                        )
                      }
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {localEnv.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No env vars. Click Add to create one.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 text-sm rounded-lg border hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 text-sm rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
