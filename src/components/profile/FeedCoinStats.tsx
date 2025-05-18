
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  RefreshCcw, 
  Plus, 
  TrendingUp,
  Medal,
  Gift,
  Loader2
} from "lucide-react";
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Sample transaction history data
const transactionHistory = [
  {
    id: "tx-001",
    type: "receive",
    amount: 25,
    sender: "Food Donation #1234",
    timestamp: "2025-04-20T08:30:00Z",
    description: "Reward for donating food",
    status: "completed"
  },
  {
    id: "tx-002",
    type: "receive",
    amount: 15,
    sender: "Volunteer Activity",
    timestamp: "2025-04-15T14:45:00Z",
    description: "Reward for volunteering",
    status: "completed"
  },
  {
    id: "tx-003",
    type: "send",
    amount: 10,
    recipient: "Community Kitchen",
    timestamp: "2025-04-10T11:20:00Z",
    description: "Donation to community kitchen",
    status: "completed"
  },
  {
    id: "tx-004",
    type: "receive",
    amount: 30,
    sender: "Food Rescue #789",
    timestamp: "2025-04-05T16:10:00Z",
    description: "Reward for food rescue",
    status: "completed"
  },
  {
    id: "tx-005",
    type: "send",
    amount: 5,
    recipient: "FeedForward Platform",
    timestamp: "2025-03-29T09:15:00Z",
    description: "Platform fee",
    status: "completed"
  }
];

// Sample donation/claim history
const activityHistory = [
  {
    id: "act-001",
    type: "donation",
    item: "Vegetables and Fruits",
    quantity: "10 kg",
    timestamp: "2025-04-22T10:30:00Z",
    status: "completed",
    recipient: "Mumbai Food Bank",
    rewardEarned: 25
  },
  {
    id: "act-002",
    type: "volunteer",
    activity: "Food Distribution",
    duration: "3 hours",
    timestamp: "2025-04-18T16:00:00Z",
    status: "completed",
    location: "Dharavi Community Center",
    rewardEarned: 15
  },
  {
    id: "act-003",
    type: "claim",
    item: "Bread and Pastries",
    quantity: "15 units",
    timestamp: "2025-04-12T09:45:00Z",
    status: "completed",
    donor: "Daily Bread Bakery",
    rewardEarned: 0
  },
  {
    id: "act-004",
    type: "donation",
    item: "Packaged Meals",
    quantity: "20 boxes",
    timestamp: "2025-04-08T14:20:00Z",
    status: "completed",
    recipient: "Street Children NGO",
    rewardEarned: 30
  },
  {
    id: "act-005",
    type: "volunteer",
    activity: "Food Pickup & Delivery",
    duration: "2 hours",
    timestamp: "2025-04-02T17:30:00Z",
    status: "completed",
    location: "Multiple Locations",
    rewardEarned: 10
  }
];

// Sample badges data
const userBadges = [
  {
    id: "badge-001",
    name: "Food Hero",
    description: "Donated more than 50kg of food",
    earned: "2025-03-10",
    icon: "🥇",
    tier: "gold"
  },
  {
    id: "badge-002",
    name: "Volunteer Star",
    description: "Completed 10 volunteer activities",
    earned: "2025-02-15",
    icon: "⭐",
    tier: "silver"
  },
  {
    id: "badge-003",
    name: "Early Adopter",
    description: "Joined during platform launch",
    earned: "2024-11-01",
    icon: "🚀",
    tier: "bronze"
  },
  {
    id: "badge-004",
    name: "Community Builder",
    description: "Referred 5 new users to the platform",
    earned: "2025-01-20",
    icon: "👥",
    tier: "silver"
  }
];

// Sample NFTs data for fallback
const sampleNFTs = [
  {
    id: "nft-001",
    name: "First Donation NFT",
    description: "Commemorating your first food donation",
    earned: "2024-12-15",
    image: "/placeholder.svg",
    token: "NFT#12345"
  },
  {
    id: "nft-002",
    name: "Hunger Hero NFT",
    description: "Awarded for exceptional contribution to fighting hunger",
    earned: "2025-02-28",
    image: "/placeholder.svg",
    token: "NFT#67890"
  }
];

// Sample leaderboard data
const leaderboardData = [
  { rank: 1, username: "FoodSaverDelhi", points: 1250, avatar: "/placeholder.svg" },
  { rank: 2, username: "MumbaiFeeder", points: 1120, avatar: "/placeholder.svg" },
  { rank: 3, username: "GreenEarthFarms", points: 980, avatar: "/placeholder.svg" },
  { rank: 4, username: "CurrentUser", points: 840, avatar: "/placeholder.svg", isCurrentUser: true },
  { rank: 5, username: "FeedingHands", points: 780, avatar: "/placeholder.svg" },
  { rank: 6, username: "NoFoodWaste", points: 730, avatar: "/placeholder.svg" },
  { rank: 7, username: "HungerFighters", points: 690, avatar: "/placeholder.svg" },
  { rank: 8, username: "MealsForAll", points: 650, avatar: "/placeholder.svg" },
  { rank: 9, username: "FoodHeroes", points: 620, avatar: "/placeholder.svg" },
  { rank: 10, username: "KindnessKitchen", points: 580, avatar: "/placeholder.svg" }
];

interface FeedCoinStatsProps {
  balance?: number;
}

interface NFTMetadata {
  name: string;
  description: string;
  location?: string;
  image?: string;
}

interface NFTImage {
  file: File | null;
  preview: string | null;
}

const FeedCoinStats: React.FC<FeedCoinStatsProps> = ({ balance = 65 }) => {
  const { 
    isConnected, 
    address, 
    feedCoinBalance, 
    ownedNFTs, 
    fetchNFTs, 
    mintCustomNFT,
    requestTokensFromOwner,
    isLoading: web3Loading
  } = useWeb3();
  
  const [userNFTs, setUserNFTs] = useState(sampleNFTs);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingTokens, setIsRequestingTokens] = useState(false);
  const [activeTransactionsTab, setActiveTransactionsTab] = useState<string>("transactions");
  
  // NFT minting state
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata>({
    name: '',
    description: '',
    location: ''
  });
  const [nftImage, setNftImage] = useState<NFTImage>({
    file: null,
    preview: null
  });
  const [isMinting, setIsMinting] = useState(false);
  
  // Load NFTs when connected
  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(true);
      fetchNFTs().finally(() => setIsLoading(false));
    }
  }, [isConnected, address]);
  
  // Update NFTs when ownedNFTs changes
  useEffect(() => {
    if (ownedNFTs && ownedNFTs.length > 0) {
      setUserNFTs(ownedNFTs);
    }
  }, [ownedNFTs]);
  
  // Handle NFT metadata change
  const handleNFTMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNftMetadata({
      ...nftMetadata,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle NFT image change
  const handleNFTImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setNftImage({
      file,
      preview: previewUrl
    });
  };
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (nftImage.preview) {
        URL.revokeObjectURL(nftImage.preview);
      }
    };
  }, []);
  
  // Handle NFT minting
  const handleMintNFT = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!nftMetadata.name || !nftMetadata.description) {
      toast.error("Please provide a name and description for your NFT");
      return;
    }
    
    setIsMinting(true);
    try {
      const result = await mintCustomNFT(nftMetadata, nftImage.file);
      
      setShowNFTModal(false);
      setNftMetadata({
        name: '',
        description: '',
        location: ''
      });
      setNftImage({
        file: null,
        preview: null
      });
      
      toast.success("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };
  
  // Handle requesting tokens
  const handleRequestTokens = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsRequestingTokens(true);
    try {
      await requestTokensFromOwner();
      toast.success("Token request submitted successfully!");
    } catch (error) {
      console.error("Error requesting tokens:", error);
      toast.error("Failed to request tokens");
    } finally {
      setIsRequestingTokens(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">FeedCoin Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {isConnected ? parseFloat(feedCoinBalance).toFixed(2) : balance}
              </div>
              <div className="text-sm text-muted-foreground">FeedCoins</div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={handleRequestTokens}
                  disabled={isRequestingTokens || !isConnected}
                >
                  {isRequestingTokens ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Request FeedCoins
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Food Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">75</span>
              <span className="text-sm text-muted-foreground ml-1">kg saved</span>
            </div>
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Gift className="mr-1 h-4 w-4 text-blue-500" />
              <span><span className="text-blue-500 font-medium">120</span> meals provided</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lifetime Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">120</span>
              <span className="text-sm text-muted-foreground ml-1">FDC earned</span>
            </div>
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Badge className="mr-1 h-5">4</Badge>
              <span>Achievements unlocked</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>
              Your donation and claim activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions" value={activeTransactionsTab} onValueChange={setActiveTransactionsTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="activity">Donations & Claims</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionHistory.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full p-1 ${
                                tx.type === "receive" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                                "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                              }`}>
                                {tx.type === "receive" ? (
                                  <ArrowDownLeft className="h-4 w-4" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4" />
                                )}
                              </span>
                              <span className="capitalize">{tx.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{tx.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {tx.type === "receive" ? `From: ${tx.sender}` : `To: ${tx.recipient}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className={tx.type === "receive" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                            {tx.type === "receive" ? "+" : "-"}{tx.amount} FDC
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Load More
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Reward</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityHistory.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <Badge variant="outline" className={`
                              ${activity.type === "donation" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" : 
                                activity.type === "claim" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" :
                                "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"}
                            `}>
                              {activity.type === "donation" ? "Donated" : 
                                activity.type === "claim" ? "Claimed" : "Volunteered"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {activity.type === "volunteer" ? activity.activity : activity.item}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.type === "donation" ? 
                                  `${activity.quantity} to ${activity.recipient}` : 
                                  activity.type === "claim" ?
                                  `${activity.quantity} from ${activity.donor}` :
                                  `${activity.duration} at ${activity.location}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {activity.rewardEarned > 0 ? (
                              <span className="text-green-600 dark:text-green-400">+{activity.rewardEarned} FDC</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Load More
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Ranking</CardTitle>
            <CardDescription>
              Top contributors on our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user) => (
                <div key={user.rank} className={`flex items-center justify-between p-2 rounded-md ${
                  user.isCurrentUser ? "bg-muted" : ""
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-7 w-7 flex items-center justify-center rounded-full font-medium text-sm
                      ${user.rank === 1 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : 
                        user.rank === 2 ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" :
                        user.rank === 3 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                        "bg-muted text-muted-foreground"}
                    `}>
                      {user.rank}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className={`font-medium ${user.isCurrentUser ? "text-primary" : ""}`}>
                        {user.username}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">{user.points}</span>
                    <span className="text-xs text-muted-foreground ml-1">pts</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 flex justify-center">
                <Button variant="outline" size="sm">
                  View Full Leaderboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Badges & Achievements</CardTitle>
            <CardDescription>
              Rewards earned for your contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              {userBadges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center border rounded-md p-3">
                  <div className={`text-3xl mb-2 ${
                    badge.tier === "gold" ? "text-yellow-500" :
                    badge.tier === "silver" ? "text-gray-400" :
                    "text-amber-600"
                  }`}>
                    {badge.icon}
                  </div>
                  <h4 className="font-medium text-sm">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Earned: {new Date(badge.earned).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>NFT Collection</CardTitle>
            <CardDescription>
              Unique tokens earned on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2">
                {userNFTs.map((nft) => (
                  <div key={nft.id} className="border rounded-md overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">{nft.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{nft.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{nft.token}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border rounded-md p-3 flex items-center justify-center border-dashed">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-full w-full flex flex-col gap-2 hover:bg-transparent py-6"
                    onClick={() => setShowNFTModal(true)}
                    disabled={!isConnected}
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">Mint New NFT</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* NFT Minting Dialog */}
      <Dialog open={showNFTModal} onOpenChange={setShowNFTModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mint New NFT</DialogTitle>
            <DialogDescription>
              Create a unique NFT on the blockchain to commemorate your contributions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">NFT Name</Label>
              <Input
                id="name"
                name="name"
                value={nftMetadata.name}
                onChange={handleNFTMetadataChange}
                placeholder="Enter NFT name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={nftMetadata.description}
                onChange={handleNFTMetadataChange}
                placeholder="Describe your NFT"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                name="location"
                value={nftMetadata.location}
                onChange={handleNFTMetadataChange}
                placeholder="e.g., Mumbai, India"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">NFT Image</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleNFTImageChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max size: 5MB</p>
                </div>
                <div className="border rounded-md overflow-hidden aspect-square relative">
                  {nftImage.preview ? (
                    <img 
                      src={nftImage.preview} 
                      alt="NFT Preview" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      Image Preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNFTModal(false)}
              disabled={isMinting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMintNFT}
              disabled={isMinting || !nftMetadata.name || !nftMetadata.description}
            >
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Minting...
                </>
              ) : (
                "Mint NFT"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedCoinStats;
