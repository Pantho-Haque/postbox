'use client';
import { createContext } from "react";

export interface MatchRegistry {
  register: (el: HTMLElement) => () => void;
  activeIndex: number;
}

export const MatchCtx = createContext<MatchRegistry>({
  register: () => () => {},
  activeIndex: -1,
});
