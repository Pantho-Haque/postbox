export type NoteId = string;
export type Note = { title: string; content: string };
export type NotesStore = Record<NoteId, Note>;