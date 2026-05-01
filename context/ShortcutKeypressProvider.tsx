"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useKeypress from "@/hooks/useKeypress";

type Shortcuts = {
  toggleSidebar: boolean;
};

const defaultShortcuts: Shortcuts = {
  toggleSidebar: false,
};

const ShortcutContext = createContext<{ 
  shortcuts: Shortcuts, 
  toggle: (key: keyof Shortcuts) => void 
}>({
  shortcuts: defaultShortcuts,
  toggle: () => { },
});

export function ShortcutProvider({ children }: { children: ReactNode }) {
  const [shortcuts, setShortcuts] = useState<Shortcuts>(defaultShortcuts);

  function toggle(key: keyof Shortcuts) {
    setShortcuts((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  useKeypress({
    key: "b",
    isMeta: true,
    func: () => toggle("toggleSidebar"),
  });

  return (
    <ShortcutContext.Provider value={{ shortcuts, toggle }}>
      {children}
    </ShortcutContext.Provider>
  );
}

export function useShortcuts() {
  const ctx = useContext(ShortcutContext);
  if (!ctx) throw new Error("useShortcuts must be used inside <ShortcutProvider>");
  return ctx;
}

