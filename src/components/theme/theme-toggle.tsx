"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export const darkModeEnabled = process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== "false";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  if (!darkModeEnabled) return null;
  const isDark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-muted-foreground hover:text-foreground"
    >
      <Sun className="size-4 scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
