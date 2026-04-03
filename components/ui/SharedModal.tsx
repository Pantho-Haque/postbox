"use client";

import { createPortal } from "react-dom";

export function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return createPortal(
    <div
      data-modal
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-[#0a1628] border border-white/10 rounded-xl shadow-2xl shadow-black/80 p-6 w-[380px] flex flex-col gap-5 font-mono"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,229,204,0.08), 0 24px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/30 rounded-tl-xl" />
        <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/30 rounded-tr-xl" />
        <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/30 rounded-bl-xl" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/30 rounded-br-xl" />

        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-cyan-500/60 mb-1">
            Postbox
          </p>
          <h2 className="text-sm font-bold text-white/90">{title}</h2>
          {subtitle && <p className="text-xs text-white/30 mt-1 capitalize">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ModalInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      autoFocus={autoFocus}
      className="w-full border-b border-cyan-500/30 bg-transparent outline-none py-2 text-sm text-white/80 placeholder-white/20 focus:border-cyan-400 transition-colors"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}

export function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmDanger,
  loading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDanger?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <button
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-1.5 text-xs rounded-md border border-white/10 text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="px-4 py-1.5 text-xs rounded-md font-bold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-1.5"
        style={
          confirmDanger
            ? { background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }
            : { background: "rgba(0,229,204,0.15)", border: "1px solid rgba(0,229,204,0.3)", color: "#00e5cc" }
        }
      >
        {loading && (
          <svg
            className="animate-spin h-3 w-3 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? "Loading..." : confirmLabel}
      </button>
    </div>
  );
}