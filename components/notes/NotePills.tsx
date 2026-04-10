"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { createNote, deleteNoteFromStore, filterNotes, renameNoteInStore } from "@/utils/noteModifier";
import type { NoteId, NotesStore } from "@/types";

export default function NotePills({
  noteStore,
  setNoteStore,
  selectedId,
  setSelectedId,
  isUnsaved,
  setEditContent,
  setOriginalContent,
}: {
  noteStore: NotesStore;
  setNoteStore: (store: NotesStore) => void;
  selectedId: NoteId | null;
  setSelectedId: (id: NoteId | null) => void;
  isUnsaved: boolean;
  setEditContent: (v: string) => void;
  setOriginalContent: (v: string) => void;
}) {
 
  const [renamingId, setRenamingId] = useState<NoteId | null>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const [renameValue, setRenameValue] = useState("");
   useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus();
  }, [renamingId]);

  const [search, setSearch] = useState("");
  const filtered = useCallback(
    () => filterNotes(noteStore, search),
    [noteStore, search],
  );

  function selectNote(id: NoteId) {
    if (isUnsaved && selectedId !== id) {
      if (!confirm("You have unsaved changes. Discard?")) return;
    }
    setSelectedId(id);
    setEditContent(noteStore[id].content);
    setOriginalContent(noteStore[id].content);
    setRenamingId(null);
  }

  function addNote() {
    const { id, updated } = createNote(noteStore);
    setNoteStore(updated);
    selectNote(id);
    setTimeout(() => {
      setRenamingId(id);
      setRenameValue("untitled");
    }, 50);
  }

  function handleDelete(id: NoteId) {
    if (!confirm("Delete this note?")) return;
    const updated = deleteNoteFromStore(noteStore, id);
    setNoteStore(updated);
    if (selectedId === id) {
      setSelectedId(null);
      setEditContent("");
      setOriginalContent("");
    }
  }

  function startRename(id: NoteId) {
    setRenamingId(id);
    setRenameValue(noteStore[id].title);
  }

  function confirmRename() {
    if (!renamingId || !renameValue.trim()) return;
    const update  = renameNoteInStore(noteStore, renamingId, renameValue.trim());
    setNoteStore(update);
    setRenamingId(null);
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-none focus:border-blue-400 transition-colors"
      />

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {filtered().length === 0 && (
          <p className="text-xs text-neutral-400 text-center py-4">No notes</p>
        )}

        {filtered().map(([id, note]) => {
          const isSelected = selectedId === id;
          const isRenaming = renamingId === id;

          return (
            <div
              key={id}
              onClick={() => !isRenaming && selectNote(id)}
              className={`
                group flex flex-col gap-0.5 px-2.5 py-2 rounded-lg border cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-950 dark:border-blue-600"
                    : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }
              `}
            >
              {isRenaming ? (
                <input
                  ref={renameRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmRename();
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-xs font-medium bg-transparent border-b border-blue-400 outline-none text-neutral-900 dark:text-neutral-100"
                />
              ) : (
                <span
                  className={`text-xs font-medium truncate ${isSelected ? "text-blue-800 dark:text-blue-200" : "text-neutral-700 dark:text-neutral-200"}`}
                >
                  {note.title}
                </span>
              )}

              {/* action row — only when selected */}
              {isSelected && (
                <div
                  className="flex justify-end gap-1.5 mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isRenaming ? (
                    <>
                      <button
                        onClick={confirmRename}
                        className="text-neutral-400 border border-transparent hover:border-neutral-700 rounded-full p-0.5 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        <Check size={11} />
                      </button>
                      <button
                        onClick={() => setRenamingId(null)}
                        className="text-neutral-400 border border-transparent hover:border-neutral-700 rounded-full p-0.5 hover:text-neutral-600 transition-colors cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startRename(id)}
                        className="text-neutral-400 border border-transparent hover:border-neutral-700 rounded-full p-0.5 hover:text-blue-500 transition-colors cursor-pointer"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-neutral-400 border border-transparent hover:border-neutral-700 rounded-full p-0.5  hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={11} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* add new — pinned to bottom */}
      <button
        onClick={addNote}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500 hover:border-blue-400 hover:text-blue-500 transition-all text-xs w-full"
      >
        <Plus size={11} />
        New note
      </button>
    </>
  );
}
