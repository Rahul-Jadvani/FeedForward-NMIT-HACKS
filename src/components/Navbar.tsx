
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectWallet } from "./ConnectWallet";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { UserMenu } from "./nav/UserMenu";
import { NotificationButton } from "./nav/NotificationButton";
import { NavLinks } from "./nav/NavLinks";

export function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40 border-b border-white/10 pixel-ripple">
      <nav className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <span className="font-bold text-2xl gradient-text font-futuristic tracking-wider">FeedForward</span>
        </Link>

        <NavLinks />

        <div className="flex items-center gap-3">
          <ConnectWallet />
          <ThemeSwitcher />
          <NotificationButton />
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild className="hidden md:inline-flex" variant="gradient">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
