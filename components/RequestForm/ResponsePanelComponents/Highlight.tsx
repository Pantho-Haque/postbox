'use client';
import { useContext, useRef, useEffect } from "react";
import { MatchCtx } from "./MatchContext";

export function MatchMark({ text }: { text: string }) {
  const { register, activeIndex } = useContext(MatchCtx);
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    return register(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive =
    elRef.current?.dataset.matchIndex !== undefined &&
    Number(elRef.current.dataset.matchIndex) === activeIndex;

  return (
    <mark
      ref={elRef}
      className="rounded-[2px] px-px transition-all duration-150"
      style={{
        background: isActive
          ? "rgba(250,204,21,0.55)"
          : "rgba(250,204,21,0.15)",
        color: isActive ? "#fde047" : "#fef08a",
        outline: isActive ? "1px solid rgba(250,204,21,0.7)" : "none",
        boxShadow: isActive ? "0 0 6px rgba(250,204,21,0.3)" : "none",
      }}
    >
      {text}
    </mark>
  );
}

export function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const parts: { str: string; isMatch: boolean }[] = [];
  let remaining = text;

  while (remaining.length) {
    const idx = remaining.toLowerCase().indexOf(q);
    if (idx === -1) {
      parts.push({ str: remaining, isMatch: false });
      break;
    }
    if (idx > 0) parts.push({ str: remaining.slice(0, idx), isMatch: false });
    parts.push({ str: remaining.slice(idx, idx + q.length), isMatch: true });
    remaining = remaining.slice(idx + q.length);
  }

  return (
    <>
      {parts.map((p, i) =>
        p.isMatch ? (
          <MatchMark key={i} text={p.str} />
        ) : (
          <span key={i}>{p.str}</span>
        )
      )}
    </>
  );
}
