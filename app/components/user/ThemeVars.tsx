"use client";

import { useEffect } from "react";
import type { ThemeColors } from "@/lib/server/siteData";

type Props = {
  theme: ThemeColors;
};

export default function ThemeVars({ theme }: Props) {
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-primary-soft", theme.primarySoft);
    root.style.setProperty("--color-accent", theme.accent);
    root.style.setProperty("--color-bg", theme.background);
    root.style.setProperty("--color-surface", theme.surface);
    root.style.setProperty("--color-text", theme.text);
  }, [theme]);

  return null;
}
