
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectWallet } from "./ConnectWallet";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./nav/UserMenu";
import { NotificationButton } from "./nav/NotificationButton";
import { Coins } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAccount } from "wagmi";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const { feedCoinBalance } = useWeb3();
  
  // Use real feedCoin balance if connected to blockchain, otherwise fallback to mock data
  const feedCoinBalanceDisplay = isConnected ? 
    parseFloat(feedCoinBalance).toFixed(2) : 
    "0";

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-sm border-b border-border/40">
      <nav className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <span className="font-display font-bold text-2xl gradient-text bg-gradient-to-r from-theme-green via-theme-purple to-theme-green bg-[length:200%_auto] animate-gradient">FeedForward</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/wallet" className="flex items-center gap-1 bg-amber-100/80 dark:bg-amber-900/50 px-3 py-1 rounded-full text-amber-800 dark:text-amber-200">
                    <Coins className="h-4 w-4" />
                    <span className="font-medium">{feedCoinBalanceDisplay}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>FeedCoin Balance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
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
