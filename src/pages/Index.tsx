
import Home from "./Home";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const { isConnected, address } = useAccount();
  const { ethBalance } = useWeb3();

  useEffect(() => {
    if (isConnected && address) {
      toast.info(
        "Connected to Base Sepolia", 
        {
          description: `Address: ${address.slice(0, 6)}...${address.slice(-4)} | Balance: ${parseFloat(ethBalance).toFixed(4)} ETH`,
        }
      );
    }
  }, [isConnected, address, ethBalance]);

  return <Home />;
};

export default Index;
