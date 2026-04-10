import type { NoteId } from "@/types";

interface Props {
  selectedId: NoteId | null;
  selectedTitle: string | null;
  content: string;
  isUnsaved: boolean;
  onChange: (v: string) => void;
}

export default function NoteEditor({
  selectedId,
  selectedTitle,
  content,
  isUnsaved,
  onChange,
}: Props) {
  return (
    <>
      {/* header bar */}
      <div className="flex items-center justify-between min-h-[20px]">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate">
          {selectedTitle ?? "Select a note"}
        </span>
        {isUnsaved && (
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-medium ml-2">
            unsaved
          </span>
        )}
      </div>

      {/* textarea */}
      <textarea
        disabled={!selectedId}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select a note to start editing..."
        className="flex-1 w-full resize-none px-3 py-2.5 text-sm leading-relaxed  border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-none focus:border-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-default min-h-[200px]"
      />

      {/* char count */}

      <span className="text-xs text-neutral-400 text-right">
        {content.length} chars
      </span>
    </>
  );
}
