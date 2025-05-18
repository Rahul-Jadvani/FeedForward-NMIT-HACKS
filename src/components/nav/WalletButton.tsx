// In any component that needs wallet address
const { isConnected, address } = useWeb3();

// Always check both values before using
if (isConnected && address) {
  // Use address safely here
  console.log(`Connected wallet: ${address}`);
}
import { Wallet, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAccount } from "wagmi";

export function WalletButton() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const { feedCoinBalance } = useWeb3();
  const [displayBalance, setDisplayBalance] = useState<number | null>(null);
  
  // Update display balance whenever feedCoinBalance changes
  useEffect(() => {
    if (isConnected && feedCoinBalance) {
      setDisplayBalance(parseFloat(feedCoinBalance));
    } else if (isAuthenticated) {
      // If not connected to blockchain but authenticated in app, show mock balance
      setDisplayBalance(125);
    } else {
      setDisplayBalance(null);
    }
  }, [isConnected, feedCoinBalance, isAuthenticated]);
  
  if (!isAuthenticated) {
    return null; // Don't show wallet button for unauthenticated users
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            asChild 
            variant="ghost" 
            size="icon"
            className="relative"
          >
            <Link to="/wallet">
              <Wallet className="h-5 w-5" />
              {displayBalance !== null && (
                <div className="absolute -bottom-1 -right-1 bg-ff-green text-white rounded-full h-4 px-1 text-[10px] flex items-center justify-center font-medium animate-fade-in">
                  <Coins className="h-2 w-2 mr-0.5" />
                  {displayBalance}
                </div>
              )}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Wallet: {displayBalance} FeedCoins</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
