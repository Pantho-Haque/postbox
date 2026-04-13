import { useEffect } from "react";

export default function useKeypress({ key, isMeta = false, func }: { key: string, isMeta: boolean, func: () => void }) {
    useEffect(() => {
      const listener = (e: KeyboardEvent) => {
        if (isMeta ? (e.metaKey || e.ctrlKey) && e.key === key : e.key === key) {
          e.preventDefault();
          func();
        }
      };
      window.addEventListener("keydown", listener);
      return () => window.removeEventListener("keydown", listener);
    }, [key, isMeta, func]);
  }