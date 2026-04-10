"use client";

import { NotebookIcon } from "lucide-react";
import { useState } from "react";
import { ModalShell, ModalActions, NotePills,NoteEditor } from "@/components";
import { loadStore, updateNoteContent } from "@/utils/noteModifier";
import type { NoteId, NotesStore } from "@/types";

export default function NoteModal() {
  const [noteStore, setNoteStore] = useState<NotesStore>(() => loadStore());
  const [open, setOpen] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [selectedId, setSelectedId] = useState<NoteId | null>(null);
  
 

  const isUnsaved = selectedId !== null && editContent !== originalContent;

  function saveNote() {
    if (!selectedId) return;
    console.log(selectedId, editContent)
    const updated = updateNoteContent(noteStore, selectedId, editContent);
    setNoteStore(updated);
    setOriginalContent(editContent);
  }

  

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="modal-button-mini mt-2"
      >
        <NotebookIcon size={12} />
      </button>

      {open && (
        <ModalShell title="Notebook" subtitle="" onClose={() => setOpen(false)} size="lg">
          <div className="flex gap-3 min-h-[260px]">

            {/* left — pills */}
            <div className="w-40 shrink-0 flex flex-col gap-2 border-r border-neutral-200 dark:border-neutral-700 pr-3">
              <NotePills
                noteStore={noteStore}
                setNoteStore={setNoteStore}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                isUnsaved={isUnsaved}
                setEditContent={setEditContent}
                setOriginalContent={setOriginalContent}
                />
            </div>

            {/* right — editor */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <NoteEditor
                selectedId={selectedId}
                selectedTitle={selectedId ? noteStore[selectedId]?.title : null}
                content={editContent}
                isUnsaved={isUnsaved}
                onChange={setEditContent}
              />
            </div>

          </div>

          <ModalActions
            onCancel={() => {
              setSelectedId(null)
              setEditContent("")
              setOriginalContent("")
              setOpen(false)
            }}
            onConfirm={isUnsaved ? saveNote : () => setOpen(false)}
            confirmLabel={isUnsaved ? "Save" : "Close"}
          />
        </ModalShell>
      )}
    </>
  );
}