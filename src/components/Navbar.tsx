
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectWallet } from "./ConnectWallet";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./nav/UserMenu";
import { NotificationButton } from "./nav/NotificationButton";

export function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <nav className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <span className="font-display font-bold text-2xl gradient-text bg-gradient-to-r from-theme-green via-theme-purple to-theme-green bg-[length:200%_auto] animate-gradient">FeedForward</span>
        </Link>

        <div className="flex items-center gap-4">
          <ConnectWallet />
          <ThemeToggle />
          <NotificationButton />
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild className="hidden md:inline-flex btn-gradient animate-fade-in modern-button">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
