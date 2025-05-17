
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const themes = [
  { name: 'Light', value: 'light', emoji: '☀️' },
  { name: 'Dark', value: 'dark', emoji: '🌙' },
  { name: 'Forest', value: 'forest', emoji: '🌳' },
  { name: 'Sunset', value: 'sunset', emoji: '🌅' },
  { name: 'Ocean', value: 'ocean', emoji: '🌊' },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: typeof themes[number]['value']) => {
    setTheme(newTheme);
    toast.success(`${themes.find(t => t.value === newTheme)?.name} theme activated!`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-glow hover:animate-pulse-subtle">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border border-border/50 shadow-lg animate-scale-in bg-background/90 backdrop-blur-md">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => handleThemeChange(t.value)}
            className={`${theme === t.value ? 'bg-accent' : ''} cursor-pointer transition-colors hover:bg-accent/80 flex items-center gap-2`}
          >
            <span>{t.emoji}</span> {t.name}
            {theme === t.value && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
