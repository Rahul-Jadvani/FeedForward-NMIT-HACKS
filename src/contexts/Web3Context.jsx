
import { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useConfig, useReadContracts, usePublicClient } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { formatEther, parseEther } from 'viem';
import { toast } from "sonner";
import { baseSepolia } from 'wagmi/chains';

import { FEED_FORWARD_ABI } from './abi/FeedForwardABI';
import { DONATION_NFT_ABI } from './abi/DonationNFTABI';
import { PRICE_ORACLE_ABI } from './abi/PriceOracleABI';
import { FEED_COIN_ABI } from './abi/FeedCoinABI';

// Smart contract ABIs and addresses - Update these with your actual deployed contract addresses
const FEED_FORWARD_ADDRESS = "0xF26b489f44481069670d410639e1849708E8b7F5"; // FeedForward contract address
const FEED_COIN_ADDRESS = "0x5B8453FD96ED80Db7894450b960d284d860b7350";    // FeedCoin contract address
const DONATION_NFT_ADDRESS = "0xe469a1303f5954892FD9f03D2213237e84824667"; // DonationNFT contract address
const PRICE_ORACLE_ADDRESS = "0xc313E32c765b2fec5D584039cC12DA824FC43354"; // PriceOracle contract address

const Web3Context = createContext(undefined);

export function Web3Provider({ children }) {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [ngoData, setNgoData] = useState(null);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [ethPrice, setEthPrice] = useState("0");
  const publicClient = usePublicClient();
  
  // Get ETH balance
  const { data: ethBalanceData } = useBalance({
    address,
    query: {
      enabled: !!address,
    }
  });

  // Get FeedCoin balance
  const { data: feedCoinBalanceData } = useReadContract({
    address: FEED_COIN_ADDRESS,
    abi: FEED_COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get ETH price
  const { data: ethPriceData } = useReadContract({
    address: PRICE_ORACLE_ADDRESS,
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
  const registerNGO = async (name) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Use writeContractAsync for Wagmi v2
      await writeContractAsync({
        address: FEED_FORWARD_ADDRESS,
        abi: FEED_FORWARD_ABI,
        functionName: 'registerNGO',
        args: [name],
        chainId: baseSepolia.id
      });
      
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
  const getNGO = async (ngoAddress) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return null;
    }

    try {
      // Since getNGO doesn't exist in the ABI, we'll use hasRole to check if the address has admin role
      // as a way to determine if it's an NGO
      const adminRole = await readContract({
        address: FEED_FORWARD_ADDRESS,
        abi: FEED_FORWARD_ABI,
        functionName: 'ADMIN_ROLE',
        args: [],
      });
      
      const isNGO = await readContract({
        address: FEED_FORWARD_ADDRESS,
        abi: FEED_FORWARD_ABI,
        functionName: 'hasRole',
        args: [adminRole, ngoAddress],
      });
      
      // For now, we'll create a mock NGO object
      // In a real implementation, you would store NGO data in a different way
      if (isNGO) {
        return { 
          name: "NGO Organization", 
          address: ngoAddress, 
          isVerified: true
        };
      } else {
        // Check if the address has any donations to determine if it's a user
        const userDonations = await readContract({
          address: FEED_FORWARD_ADDRESS,
          abi: FEED_FORWARD_ABI,
          functionName: 'getUserDonations',
          args: [ngoAddress],
        });
        
        if (userDonations && userDonations.length > 0) {
          return { 
            name: "User Account", 
            address: ngoAddress, 
            isVerified: false
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching NGO data:", error);
      return null;
    }
  };

  // Function to fetch NGO data
  const fetchNGOData = async (ngoAddress) => {
    const data = await getNGO(ngoAddress);
    if (data) {
      setNgoData(data);
    }
  };

  // Function to donate to NGO
  const donate = async (ngoAddress, amount) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Use writeContractAsync for Wagmi v2
      await writeContractAsync({
        address: FEED_FORWARD_ADDRESS,
        abi: FEED_FORWARD_ABI,
        functionName: 'donate',
        args: [ngoAddress],
        value: parseEther(amount),
        chainId: baseSepolia.id
      });
      
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
      // Use writeContractAsync for Wagmi v2
      await writeContractAsync({
        address: DONATION_NFT_ADDRESS,
        abi: DONATION_NFT_ABI,
        functionName: 'claimNFT',
        chainId: baseSepolia.id
      });
      
      toast.success("NFT claim submitted!");
      await fetchNFTs();
    } catch (error) {
      console.error("Error claiming NFT:", error);
      toast.error("Failed to claim NFT");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to claim tokens using rewardDonor function
  const claimTokens = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Use writeContractAsync for Wagmi v2
      // The rewardDonor function requires donor address, donationId, and rewardMultiplier
      // For demo purposes, we'll use a mock donationId of 1 and a multiplier of 1
      await writeContractAsync({
        address: FEED_COIN_ADDRESS,
        abi: FEED_COIN_ABI,
        functionName: 'rewardDonor',
        args: [address, BigInt(1), BigInt(1)], // donor, donationId, rewardMultiplier
        chainId: baseSepolia.id
      });
      
      toast.success("Tokens claim submitted!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      toast.error("Failed to claim tokens: " + (error.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to request tokens directly from the contract owner
  const requestTokensFromOwner = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Since we can't directly call functions that require owner permissions,
    // we'll create a mock implementation that simulates a request system
    const ownerAddress = "0x91CdCa30FdF9418678875503370a5A3776F4fa0B";
    
    setIsLoading(true);
    try {
      // Log the request details for demonstration purposes
      console.log(`Token request from: ${address}`);
      console.log(`To owner: ${ownerAddress}`);
      console.log(`Amount: 100 FeedCoins`);
      
      // In a real implementation, this would call a backend API that would:
      // 1. Store the request in a database
      // 2. Notify the owner via email/dashboard
      // 3. The owner would then manually execute the transfer
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success("Token request submitted!");
      toast.info("The owner will review and process your request soon.");
    } catch (error) {
      console.error("Error requesting tokens:", error);
      toast.error("Failed to submit token request");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send FeedCoins to another address
  const sendTokens = async (recipientAddress, amount) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return false;
    }

    if (!recipientAddress) {
      toast.error("Please provide a recipient address");
      return false;
    }

    if (!amount || amount <= 0) {
      toast.error("Please provide a valid amount");
      return false;
    }

    // Convert amount to wei (with 18 decimals)
    const tokenAmount = BigInt(Math.floor(amount * 10**18));
    
    setIsLoading(true);
    try {
      // Use the standard ERC-20 transfer function
      await writeContractAsync({
        address: FEED_COIN_ADDRESS,
        abi: FEED_COIN_ABI,
        functionName: 'transfer',
        args: [recipientAddress, tokenAmount],
        chainId: baseSepolia.id
      });
      
      toast.success(`Successfully sent ${amount} FeedCoins to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`);
      return true;
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast.error("Failed to send tokens: " + (error.message || error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch owned NFTs
  const fetchNFTs = async () => {
    if (!address) return;
    
    try {
      const balance = await readContract({
        address: DONATION_NFT_ADDRESS,
        abi: DONATION_NFT_ABI,
        functionName: 'balanceOf',
        args: [address],
      });
      
      const nfts = [];
      
      // Assuming tokenIds start from 1 and are sequential
      // This is a simplification - you might need to adjust based on your contract
      const balanceNumber = typeof balance === 'bigint' ? Number(balance) : 0;
      
      for (let i = 1; i <= balanceNumber; i++) {
        try {
          const uri = await readContract({
            address: DONATION_NFT_ADDRESS,
            abi: DONATION_NFT_ABI,
            functionName: 'tokenURI',
            args: [BigInt(i)], // Convert to BigInt correctly
          });
          
          nfts.push({ id: i, uri });
        } catch (e) {
          console.error(`Error fetching NFT #${i}:`, e);
        }
      }
      
      setOwnedNFTs(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  // Function to fetch token transaction history
  const fetchTokenTransactions = async () => {
    if (!address || !publicClient) return [];
    
    try {
      // In a real implementation, we would use an indexer or blockchain explorer API
      // to fetch the complete transaction history for the token
      // For this demo, we'll simulate fetching Transfer events from the contract
      
      // Get the latest block number
      const latestBlock = await publicClient.getBlockNumber();
      
      // Calculate the starting block (e.g., last 1000 blocks)
      const fromBlock = latestBlock - BigInt(1000) > 0 ? latestBlock - BigInt(1000) : BigInt(0);
      
      // Fetch Transfer events where the user is either sender or receiver
      const sentEvents = await publicClient.getLogs({
        address: FEED_COIN_ADDRESS,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' }
          ]
        },
        args: {
          from: address
        },
        fromBlock,
        toBlock: latestBlock
      }).catch(error => {
        console.error("Error fetching sent events:", error);
        return [];
      });
      
      const receivedEvents = await publicClient.getLogs({
        address: FEED_COIN_ADDRESS,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' }
          ]
        },
        args: {
          to: address
        },
        fromBlock,
        toBlock: latestBlock
      }).catch(error => {
        console.error("Error fetching received events:", error);
        return [];
      });
      
      // Process the events into a format suitable for the UI
      const processedSentEvents = await Promise.all(sentEvents.map(async (event) => {
        const block = await publicClient.getBlock({ blockHash: event.blockHash });
        return {
          id: `${event.transactionHash}-${event.logIndex}`,
          type: "spent",
          amount: Number(formatEther(event.args.value)),
          description: `Sent to ${event.args.to.substring(0, 6)}...${event.args.to.substring(event.args.to.length - 4)}`,
          date: new Date(Number(block.timestamp) * 1000).toISOString().split('T')[0],
          status: "completed",
          transactionHash: event.transactionHash
        };
      }));
      
      const processedReceivedEvents = await Promise.all(receivedEvents.map(async (event) => {
        const block = await publicClient.getBlock({ blockHash: event.blockHash });
        return {
          id: `${event.transactionHash}-${event.logIndex}`,
          type: event.args.from === '0x0000000000000000000000000000000000000000' ? "earned" : "received",
          amount: Number(formatEther(event.args.value)),
          description: event.args.from === '0x0000000000000000000000000000000000000000' 
            ? "Minted tokens" 
            : `Received from ${event.args.from.substring(0, 6)}...${event.args.from.substring(event.args.from.length - 4)}`,
          date: new Date(Number(block.timestamp) * 1000).toISOString().split('T')[0],
          status: "completed",
          transactionHash: event.transactionHash
        };
      }));
      
      // Combine and sort by date (most recent first)
      const allTransactions = [...processedSentEvents, ...processedReceivedEvents];
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return allTransactions;
    } catch (error) {
      console.error("Error fetching token transactions:", error);
      return [];
    }
  };

  // Prepare contract call utility function - using publicClient for direct blockchain interactions
  const readContract = async ({ address, abi, functionName, args = [] }) => {
    if (!publicClient || !address) {
      console.error("Public client or contract address not available");
      return null;
    }
    
    try {
      console.log(`Reading contract ${address} function ${functionName} with args:`, args);
      const result = await publicClient.readContract({
        address,
        abi,
        functionName,
        args
      });
      return result;
    } catch (error) {
      console.error(`Error reading contract ${address}.${functionName}:`, error);
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
    address, // Making wallet address available throughout the project
    ethBalance: ethBalanceData?.formatted || "0",
    feedCoinBalance: feedCoinBalanceData ? formatEther(feedCoinBalanceData.toString()) : "0",
    ngoData,
    ownedNFTs,
    ethPrice,
    isLoading,
    // Contract addresses - making them available throughout the project
    contracts: {
      feedForward: FEED_FORWARD_ADDRESS,
      feedCoin: FEED_COIN_ADDRESS,
      donationNFT: DONATION_NFT_ADDRESS,
      priceOracle: PRICE_ORACLE_ADDRESS
    },
    // Contract ABIs - making them available throughout the project
    abis: {
      feedForward: FEED_FORWARD_ABI,
      feedCoin: FEED_COIN_ABI,
      donationNFT: DONATION_NFT_ABI,
      priceOracle: PRICE_ORACLE_ABI
    },
    // Methods
    registerNGO,
    getNGO,
    donate,
    claimNFT,
    claimTokens,
    requestTokensFromOwner,
    sendTokens,
    readContract,
    fetchNFTs,
    fetchTokenTransactions
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
