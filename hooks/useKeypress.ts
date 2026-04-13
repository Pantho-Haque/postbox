import { useEffect, useRef } from "react";

export default function useKeypress({ key, isMeta = false, isShift = false, func }: { 
  key: string; 
  isMeta?: boolean; 
  isShift?: boolean; 
  func: () => void 
}) {
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;  // ← moved inside effect, not during render
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const isTargetKey  = e.key.toLowerCase() === key.toLowerCase();
      const isMetaOk     = !isMeta  || (e.metaKey || e.ctrlKey);
      const isShiftOk    = !isShift || e.shiftKey;

      if (isTargetKey && isMetaOk && isShiftOk) {
        e.preventDefault();
        funcRef.current();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [key, isMeta, isShift]);
}