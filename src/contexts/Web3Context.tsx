
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useConfig, useReadContracts } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { toast } from "sonner";
import { baseSepolia } from 'wagmi/chains';

// Smart contract ABIs and addresses
const FEED_FORWARD_ADDRESS = "0x123..."; // Replace with actual contract address
const FEED_COIN_ADDRESS = "0x456...";    // Replace with actual contract address
const DONATION_NFT_ADDRESS = "0x789..."; // Replace with actual contract address
const PRICE_ORACLE_ADDRESS = "0xabc..."; // Replace with actual contract address

// Simplified ABIs - Replace with actual ABIs
const FEED_FORWARD_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_ngo", "type": "address"}
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"}
    ],
    "name": "registerNGO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_ngo", "type": "address"}
    ],
    "name": "getNGO",
    "outputs": [
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "address", "name": "", "type": "address"},
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const FEED_COIN_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const DONATION_NFT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "tokenURI",
    "outputs": [
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const PRICE_ORACLE_ABI = [
  {
    "inputs": [],
    "name": "getLatestPrice",
    "outputs": [
      {"internalType": "int256", "name": "", "type": "int256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Interface definitions
interface NGO {
  name: string;
  address: string;
  isVerified: boolean;
}

interface NFT {
  id: number;
  uri: string;
}

interface Web3ContextType {
  isConnected: boolean;
  address: string | undefined;
  ethBalance: string;
  feedCoinBalance: string;
  ngoData: NGO | null;
  ownedNFTs: NFT[];
  ethPrice: string;
  isLoading: boolean;
  registerNGO: (name: string) => Promise<void>;
  getNGO: (ngoAddress: string) => Promise<NGO | null>;
  donate: (ngoAddress: string, amount: string) => Promise<void>;
  claimNFT: () => Promise<void>;
  claimTokens: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [ngoData, setNgoData] = useState<NGO | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [ethPrice, setEthPrice] = useState("0");
  
  // Get ETH balance - fixed to use Wagmi v2 API
  const { data: ethBalanceData } = useBalance({
    address,
    query: {
      enabled: !!address,
    }
  });

  // Get FeedCoin balance
  const { data: feedCoinBalanceData } = useReadContract({
    address: FEED_COIN_ADDRESS as `0x${string}`,
    abi: FEED_COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get ETH price
  const { data: ethPriceData } = useReadContract({
    address: PRICE_ORACLE_ADDRESS as `0x${string}`,
    abi: PRICE_ORACLE_ABI,
    functionName: 'getLatestPrice',
    query: {
      enabled: true,
    },
  });

  // Contract write hooks
  const { writeContractAsync } = useWriteContract();
  
  // Effect to update ETH price
  useEffect(() => {
    if (ethPriceData) {
      setEthPrice(ethPriceData.toString());
    }
  }, [ethPriceData]);

  // Function to register NGO
  const registerNGO = async (name: string) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Create a contract configuration object
      const { request } = await config.publicClient.simulateContract({
        address: FEED_FORWARD_ADDRESS as `0x${string}`,
        abi: FEED_FORWARD_ABI,
        functionName: 'registerNGO',
        args: [name],
        account: address,
      });
      
      await writeContractAsync(request);
      
      toast.success("NGO registration submitted successfully!");
      await fetchNGOData(address);
    } catch (error) {
      console.error("Error registering NGO:", error);
      toast.error("Failed to register NGO");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get NGO data
  const getNGO = async (ngoAddress: string): Promise<NGO | null> => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return null;
    }

    try {
      const result = await readContract({
        address: FEED_FORWARD_ADDRESS as `0x${string}`,
        abi: FEED_FORWARD_ABI,
        functionName: 'getNGO',
        args: [ngoAddress as `0x${string}`],
      });
      
      if (result && Array.isArray(result) && result.length === 3) {
        const [name, addr, isVerified] = result;
        return { 
          name: name as string, 
          address: addr as string, 
          isVerified: isVerified as boolean 
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching NGO data:", error);
      return null;
    }
  };

  // Function to fetch NGO data
  const fetchNGOData = async (ngoAddress: string) => {
    const data = await getNGO(ngoAddress);
    if (data) {
      setNgoData(data);
    }
  };

  // Function to donate to NGO
  const donate = async (ngoAddress: string, amount: string) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Create a contract configuration object
      const { request } = await config.publicClient.simulateContract({
        address: FEED_FORWARD_ADDRESS as `0x${string}`,
        abi: FEED_FORWARD_ABI,
        functionName: 'donate',
        args: [ngoAddress as `0x${string}`],
        account: address,
        value: parseEther(amount),
      });
      
      await writeContractAsync(request);
      
      toast.success("Donation successful!");
    } catch (error) {
      console.error("Error donating:", error);
      toast.error("Donation failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to claim NFT
  const claimNFT = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Create a contract configuration object
      const { request } = await config.publicClient.simulateContract({
        address: DONATION_NFT_ADDRESS as `0x${string}`,
        abi: DONATION_NFT_ABI,
        functionName: 'claimNFT',
        account: address,
      });
      
      await writeContractAsync(request);
      
      toast.success("NFT claim submitted!");
      await fetchNFTs();
    } catch (error) {
      console.error("Error claiming NFT:", error);
      toast.error("Failed to claim NFT");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to claim tokens
  const claimTokens = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Create a contract configuration object
      const { request } = await config.publicClient.simulateContract({
        address: FEED_COIN_ADDRESS as `0x${string}`,
        abi: FEED_COIN_ABI,
        functionName: 'claimTokens',
        account: address,
      });
      
      await writeContractAsync(request);
      
      toast.success("Tokens claim submitted!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      toast.error("Failed to claim tokens");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch owned NFTs
  const fetchNFTs = async () => {
    if (!address) return;
    
    try {
      const balance = await readContract({
        address: DONATION_NFT_ADDRESS as `0x${string}`,
        abi: DONATION_NFT_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });
      
      const nfts: NFT[] = [];
      
      // Assuming tokenIds start from 1 and are sequential
      // This is a simplification - you might need to adjust based on your contract
      const balanceNumber = typeof balance === 'bigint' ? Number(balance) : 0;
      
      for (let i = 1; i <= balanceNumber; i++) {
        try {
          const uri = await readContract({
            address: DONATION_NFT_ADDRESS as `0x${string}`,
            abi: DONATION_NFT_ABI,
            functionName: 'tokenURI',
            args: [BigInt(i)],
          });
          
          nfts.push({ id: i, uri: uri as string });
        } catch (e) {
          console.error(`Error fetching NFT #${i}:`, e);
        }
      }
      
      setOwnedNFTs(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  // Prepare contract call utility function - updated for compatibility
  const readContract = async ({ address, abi, functionName, args = [] }: any) => {
    // This is a mock implementation for demonstration purposes
    console.log(`Reading contract ${address} function ${functionName} with args:`, args);
    
    // Return mock data based on the function name
    if (functionName === 'balanceOf') {
      return BigInt(1000000000000000000); // Mock balance of 1 token
    } else if (functionName === 'tokenURI') {
      return `https://example.com/token/${args[0]}`; // Mock token URI
    } else if (functionName === 'getNGO') {
      return ["Mock NGO", args[0], true]; // Mock NGO data
    } else {
      return null;
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (address) {
      fetchNGOData(address);
      fetchNFTs();
    }
  }, [address]);

  const value = {
    isConnected,
    address,
    ethBalance: ethBalanceData?.formatted || "0",
    feedCoinBalance: feedCoinBalanceData ? formatEther(feedCoinBalanceData.toString()) : "0",
    ngoData,
    ownedNFTs,
    ethPrice,
    isLoading,
    registerNGO,
    getNGO,
    donate,
    claimNFT,
    claimTokens,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
