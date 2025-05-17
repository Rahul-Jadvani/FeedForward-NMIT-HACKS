
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
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
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      toast.success(`${newTheme === 'light' ? 'Light' : 'Dark'} mode activated!`);
      setIsRotating(false);
    }, 300);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0"
      aria-label="Toggle theme"
    >
      <div className={`transition-transform duration-300 ${isRotating ? 'rotate-[360deg]' : ''}`}>
        {theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-all hover:text-yellow-300" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] text-slate-900 transition-all hover:text-slate-700" />
        )}
      </div>
    </Button>
  );
}
