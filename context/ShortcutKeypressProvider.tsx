"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";

type Shortcuts = {
  sendRequest: boolean; // Ctrl/Cmd + Enter
  //   focusUrl:       boolean; // Ctrl/Cmd + L
  //   newTab:         boolean; // Ctrl/Cmd + T
  //   closeTab:       boolean; // Ctrl/Cmd + W
  //   nextTab:        boolean; // Ctrl/Cmd + ]
  //   prevTab:        boolean; // Ctrl/Cmd + [
  saveRequest: boolean; // Ctrl/Cmd + S
  toggleSidebar: boolean; // Ctrl/Cmd + B
  //   openSearch:     boolean; // Ctrl/Cmd + K
  //   escape:         boolean; // Escape
};

const defaultShortcuts: Shortcuts = {
  sendRequest: false,
  saveRequest: false,
  toggleSidebar: false,
};

const ShortcutContext = createContext<{ shortcuts: Shortcuts, toggle: (key: keyof Shortcuts) => void, fire: (key: keyof Shortcuts) => void, consume: (key: keyof Shortcuts) => void }>({
  shortcuts: defaultShortcuts,
  toggle: () => { },
  fire: () => { },
  consume: () => { },
});
export function ShortcutProvider({ children }: { children: ReactNode }) {
  const [shortcuts, setShortcuts] = useState<Shortcuts>(defaultShortcuts);

  function fire(key: keyof Shortcuts) {
    setShortcuts((prev) => ({ ...prev, [key]: true }));
  }

  function consume(key: keyof Shortcuts) {
    setShortcuts((prev) => ({ ...prev, [key]: false }));
  }

  function toggle(key: keyof Shortcuts) {
    setShortcuts((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey; // Cmd on Mac, Ctrl on Windows
      const tag = (e.target as HTMLElement).tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      // Cmd/Ctrl combos — block browser defaults selectively
      if (mod) {
        switch (e.key) {
          case "b":
          case "B": if (!isTyping) { e.preventDefault(); toggle("toggleSidebar"); } break;
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <ShortcutContext.Provider value={{ shortcuts, toggle, fire, consume }}>
      {children}
    </ShortcutContext.Provider>
  );
}

// ---- hook ----

export function useShortcuts() {
  const ctx = useContext(ShortcutContext);
  if (!ctx) throw new Error("useShortcuts must be used inside <ShortcutProvider>");
  return ctx;
}

