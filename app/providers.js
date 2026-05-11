"use client";

import { DarkModeProvider } from "./context/DarkModeContext";

export function Providers({ children }) {
  return <DarkModeProvider>{children}</DarkModeProvider>;
}
