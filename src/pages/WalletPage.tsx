
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { formatEther } from "viem";
import { Wallet, History, ArrowUp, ArrowDown, Users, Award, Coins, RefreshCw, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock transaction data
interface Transaction {
  id: string;
  type: "earned" | "spent" | "received";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function WalletPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { 
    isConnected, 
    address, 
    feedCoinBalance: web3FeedCoinBalance, 
    ethBalance,
    isLoading: web3Loading,
    requestTokensFromOwner,
    sendTokens
  } = useWeb3();
  const [activeTab, setActiveTab] = useState<string>("balance");
  const [isLoading, setIsLoading] = useState(true);
  const [feedCoinBalance, setFeedCoinBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [claimingTokens, setClaimingTokens] = useState(false);
  
  // Send tokens state
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to view your wallet",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Fetch wallet data
  useEffect(() => {
    if (isAuthenticated) {
      // Use real blockchain data if connected, otherwise use mock data
      if (isConnected && web3FeedCoinBalance) {
        // Convert from Wei to Ether and then to a number
        const balanceNumber = parseFloat(web3FeedCoinBalance);
        setFeedCoinBalance(balanceNumber);
        
        // Keep some mock transactions for now, but we can replace these with real ones later
        setTransactions([{
            id: "tx-001",
            type: "earned",
            amount: 50,
            description: "Donation: Corporate Lunch Leftovers",
            date: "2025-04-23",
            status: "completed"
          },
          {
            id: "tx-002",
            type: "earned",
            amount: 30,
            description: "Achievement: First-Time Donor",
            date: "2025-04-20",
            status: "completed"
          }
        ]);
      } else {
        // Fallback to mock data if not connected to blockchain
        setFeedCoinBalance(0);
        setTransactions([{
            id: "tx-001",
            type: "earned",
            amount: 50,
            description: "Donation: Corporate Lunch Leftovers",
            date: "2025-04-23",
            status: "completed"
          },
          {
            id: "tx-002",
            type: "earned",
            amount: 30,
            description: "Achievement: First-Time Donor",
            date: "2025-04-20",
            status: "completed"
          }
        ]);
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, isConnected, web3FeedCoinBalance]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // If connected to blockchain, we can refresh the real data
      if (isConnected) {
        // Here you would typically call functions to refresh blockchain data
        // For now, we'll just wait a bit to simulate the refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Mock refresh for non-connected users
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Wallet refreshed",
        description: "Your wallet information is up to date",
      });
    } catch (error) {
      console.error("Error refreshing wallet:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh wallet information",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Function to request tokens from the owner
  const handleClaimTokens = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to request tokens",
        variant: "destructive"
      });
      return;
    }
    
    setClaimingTokens(true);
    try {
      // Using requestTokensFromOwner function
      await requestTokensFromOwner();
      
      // Add a new transaction to the list
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: "earned",
        amount: 100, // 100 tokens
        description: "Requested FeedCoin tokens",
        date: new Date().toISOString().split('T')[0],
        status: "pending"
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // No need for additional toast as the requestTokensFromOwner function already shows toasts
      
      // Refresh the wallet after requesting
      handleRefresh();
    } catch (error) {
      console.error("Error requesting tokens:", error);
      toast({
        title: "Request failed",
        description: "Failed to request tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setClaimingTokens(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <ArrowDown className="h-4 w-4 text-ff-green" />;
      case "spent":
        return <ArrowUp className="h-4 w-4 text-ff-orange" />;
      case "received":
        return <Users className="h-4 w-4 text-ff-yellow" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
        return "text-ff-green";
      case "spent":
        return "text-ff-orange";
      case "received":
        return "text-ff-yellow";
      default:
        return "";
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  // Handle sending tokens
  const handleSendTokens = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send tokens",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientAddress) {
      toast({
        title: "Missing recipient",
        description: "Please enter a recipient address",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > feedCoinBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough FeedCoins",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    try {
      const success = await sendTokens(recipientAddress, amount);
      
      if (success) {
        // Add a new transaction to the list
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          type: "spent",
          amount: amount,
          description: `Sent to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`,
          date: new Date().toISOString().split('T')[0],
          status: "completed"
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        
        // Close the dialog and reset form
        setSendDialogOpen(false);
        setRecipientAddress("");
        setSendAmount("");
        
        // Refresh the wallet
        handleRefresh();
      }
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast({
        title: "Send failed",
        description: "Failed to send tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">FeedCoin Wallet</h1>
            <p className="text-muted-foreground">Manage your impact rewards</p>
          </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/marketplace')}
          >
            <Award className="h-4 w-4 mr-1" />
            Marketplace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2">
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle>FeedCoin Balance</CardTitle>
              <CardDescription>Your current earning and spending power</CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-ff-green/20 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-ff-green" />
                    </div>
                    <div>
                      <div className="text-3xl md:text-4xl font-bold">{feedCoinBalance} FC</div>
                      <div className="text-sm text-muted-foreground">FeedCoin Balance</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <Button className="btn-gradient">
                      <Award className="mr-2 h-4 w-4" />
                      Redeem Rewards
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSendDialogOpen(true)}
                      disabled={!isConnected || feedCoinBalance <= 0}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send FeedCoins
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6 animate-fade-in" style={{animationDelay: "0.1s"}}>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent FeedCoin activity</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p>No transactions yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start donating or claiming food to earn FeedCoins
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type !== "spent" ? "+" : "-"}{transaction.amount} FC
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right column */}
        <div>
          <Card className="animate-fade-in" style={{animationDelay: "0.2s"}}>
            <CardHeader>
              <CardTitle>Earning Opportunities</CardTitle>
              <CardDescription>Ways to increase your FeedCoin balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md hover:bg-muted transition-colors">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Donate Food</div>
                  <Badge variant="outline" className="bg-ff-green/20 text-ff-green">
                    +30-100 FC
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Create FoodFlags for surplus food
                </p>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Donate Now
                </Button>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-muted transition-colors">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Refer Friends</div>
                  <Badge variant="outline" className="bg-ff-yellow/20 text-ff-yellow">
                    +50 FC
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  For each friend who joins and donates
                </p>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Invite Friends
                </Button>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-muted transition-colors">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Complete Achievements</div>
                  <Badge variant="outline" className="bg-ff-orange/20 text-ff-orange">
                    +25-200 FC
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Unlock badges and earn rewards
                </p>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  View Achievements
                </Button>
              </div>
              
              {/* Claim Tokens Button - This will trigger an actual blockchain transaction */}
              <div className="p-4 border rounded-md hover:bg-muted transition-colors bg-muted">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Request FeedCoins</div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    +100 FC
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Request FeedCoin tokens from the contract owner
                </p>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="mt-2 w-full bg-green-600 hover:bg-green-700"
                  onClick={handleClaimTokens}
                  disabled={claimingTokens || !isConnected}
                >
                  {claimingTokens ? "Requesting..." : "Request Tokens"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 animate-fade-in" style={{animationDelay: "0.3s"}}>
            <CardHeader>
              <CardTitle>FeedCoin Details</CardTitle>
              <CardDescription>About your impact tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">FeedCoin Rate</span>
                <span>1 FC ≈ $0.10 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Earned</span>
                <span>550 FC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spent</span>
                <span>200 FC</span>
              </div>
              <Separator />
              <div className="p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">About FeedCoins</h4>
                <p className="text-sm text-muted-foreground">
                  FeedCoins are rewards for your positive impact on food waste reduction. 
                  They can be redeemed for products, services, or donated to causes.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      {/* Send FeedCoins Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send FeedCoins</DialogTitle>
            <DialogDescription>
              Transfer FeedCoins to another wallet address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                Recipient
              </Label>
              <Input
                id="recipient"
                placeholder="0x..."
                className="col-span-3"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">FC</span>
              </div>
            </div>
            <div className="col-span-4 text-sm text-muted-foreground">
              <div className="flex justify-between mt-2">
                <span>Available balance:</span>
                <span>{feedCoinBalance} FC</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSendTokens} 
              disabled={isSending || !isConnected || !recipientAddress || !sendAmount}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
