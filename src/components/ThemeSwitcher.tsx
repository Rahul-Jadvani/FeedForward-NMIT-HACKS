
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(`${newTheme === 'light' ? 'Light' : 'Dark'} theme activated!`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-glow hover:animate-pulse-subtle">
          {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border border-border/50 shadow-lg animate-scale-in bg-background/90 backdrop-blur-md">
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className={`${theme === 'light' ? 'bg-accent' : ''} cursor-pointer transition-colors hover:bg-accent/80 flex items-center gap-2`}
        >
          <span>☀️</span> Light
          {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className={`${theme === 'dark' ? 'bg-accent' : ''} cursor-pointer transition-colors hover:bg-accent/80 flex items-center gap-2`}
        >
          <span>🌙</span> Dark
          {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
