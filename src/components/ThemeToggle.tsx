
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsRotating(true);
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} mode activated!`);
      setIsRotating(false);
    }, 300);
  };

  if (!isMounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-glow"
      aria-label="Toggle theme"
    >
      <div className={`transition-transform duration-300 ${isRotating ? 'rotate-180' : ''}`}>
        {theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-transform animate-pulse-subtle" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] text-slate-900 transition-transform animate-pulse-subtle" />
        )}
      </div>
    </Button>
  );
}
