"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "uz-cyrl" | "uz-latn" | "ru";
export type ThemeMode = "light" | "dark";

interface UiState {
  theme: ThemeMode;
  lang: Lang;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  setLang: (l: Lang) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      lang: "uz-cyrl",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
    }),
    { name: "toza-ui" },
  ),
);
