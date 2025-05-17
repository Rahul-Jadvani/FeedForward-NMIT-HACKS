
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tractor, 
  Calendar, 
  Clock, 
  Compass, 
  Leaf, 
  MapPin, 
  Package, 
  Users, 
  BarChart,
  ArrowRight,
  Database,
  Award,
  Utensils,
  Coins,
  Trash
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { useNavigate } from "react-router-dom";

// Sample data for active farmers
const activeFarmers = [
  {
    id: "1",
    name: "Ramesh Kumar",
    location: "Nashik, Maharashtra",
    cropType: "Tomatoes",
    quantity: "500 kg",
    harvestDate: "2025-05-15",
    donationType: "Free Donation",
    status: "Available",
    feedCoinsEarned: 250,
    image: "https://images.unsplash.com/photo-1593358807259-930e5fe85899"
  },
  {
    id: "2",
    name: "Laxmi Patel",
    location: "Anand, Gujarat",
    cropType: "Potatoes",
    quantity: "750 kg",
    harvestDate: "2025-05-10",
    donationType: "Subsidized Sale",
    status: "Matched",
    feedCoinsEarned: 320,
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976"
  },
  {
    id: "3",
    name: "Satish Reddy",
    location: "Guntur, Andhra Pradesh",
    cropType: "Green Chilies",
    quantity: "200 kg",
    harvestDate: "2025-05-16",
    donationType: "Free Donation",
    status: "Available",
    feedCoinsEarned: 150,
    image: "https://images.unsplash.com/photo-1601059281162-c1750e29a637"
  },
  {
    id: "4",
    name: "Priya Singh",
    location: "Sonipat, Haryana",
    cropType: "Wheat",
    quantity: "1200 kg",
    harvestDate: "2025-05-05",
    donationType: "Subsidized Sale",
    status: "Picked Up",
    feedCoinsEarned: 500,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c2a92f19"
  }
];

// Bio-manure options
const bioManureOptions = [
  {
    id: "manure1",
    name: "Organic Compost",
    price: "Free",
    description: "Rich, nutrient-dense compost made from food waste",
    content: "NPK-rich organic matter",
    quantity: "50 kg bags",
    suitable: "All crops",
    image: "https://images.unsplash.com/photo-1593331099449-a5ce6926e848"
  },
  {
    id: "manure2",
    name: "Liquid Bio-Fertilizer",
    price: "Free",
    description: "Liquid compost tea for direct application or fertigation",
    content: "Liquid plant nutrients and beneficial microbes",
    quantity: "20 liter containers",
    suitable: "Vegetables, Fruits",
    image: "https://images.unsplash.com/photo-1565454296317-b45fe0ff1447"
  },
  {
    id: "manure3",
    name: "Vermicompost",
    price: "₹500 per 100kg",
    description: "Premium worm-processed organic fertilizer",
    content: "Worm-processed organic matter with high nutrient availability",
    quantity: "25 kg bags",
    suitable: "High-value crops",
    image: "https://images.unsplash.com/photo-1567281356755-a1bd85c22be0"
  }
];

// Impact metrics data
const impactMetrics = {
  cropsRescued: 25000,
  mealsEnabled: 75000,
  organicWasteRepurposed: 8000,
  feedCoinsDistributed: 15000,
  activeFarmers: 120,
  activeNGOs: 35
};

const FarmFeedPage = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useWeb3();
  const [cropFilter, setCropFilter] = useState("all");
  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null);
  const [donationQuantity, setDonationQuantity] = useState<string>("");
  const [activeTab, setActiveTab] = useState("farmfeed");
  const [formData, setFormData] = useState({
    cropType: "",
    quantity: "",
    harvestDate: "",
    donationType: "donation",
    price: "",
    pickupWindow: "",
    location: "",
    description: ""
  });

  // Filter farmers based on crop type
  const filteredFarmers = cropFilter === "all" 
    ? activeFarmers 
    : activeFarmers.filter(farmer => farmer.cropType.toLowerCase().includes(cropFilter.toLowerCase()));

  const handleManureRequest = (manureId: string) => {
    toast.success(`Your request for ${bioManureOptions.find(m => m.id === manureId)?.name} has been submitted!`);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cropType || !formData.quantity || !formData.harvestDate) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Your crop donation has been flagged! You will be notified when an NGO is matched.");
    // Reset form
    setFormData({
      cropType: "",
      quantity: "",
      harvestDate: "",
      donationType: "donation",
      price: "",
      pickupWindow: "",
      location: "",
      description: ""
    });
  };

  const handleViewFarmerDetails = (farmerId: string) => {
    setSelectedFarmer(farmerId);
    setActiveTab("details");
  };

  const handleBackToFarmers = () => {
    setSelectedFarmer(null);
    setActiveTab("farmfeed");
  };

  // Get the selected farmer details when needed
  const farmerDetails = selectedFarmer 
    ? activeFarmers.find(d => d.id === selectedFarmer) 
    : null;

  const renderFarmerCard = (farmer: typeof activeFarmers[0]) => (
    <Card key={farmer.id} className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={farmer.image} 
          alt={farmer.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2 bg-green-100 text-green-600 hover:bg-green-200 border-green-200">
              {farmer.cropType}
            </Badge>
            <CardTitle className="text-xl">{farmer.name}</CardTitle>
          </div>
          <Badge variant="outline" className={
            farmer.status === "Available" 
              ? "bg-green-50 text-green-600" 
              : farmer.status === "Matched" 
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600"
          }>
            {farmer.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{farmer.location}</span>
          </div>
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{farmer.quantity}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Harvest: {new Date(farmer.harvestDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Coins className="h-4 w-4 mr-1 text-amber-500" />
            <span>{farmer.feedCoinsEarned} FeedCoins earned</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => handleViewFarmerDetails(farmer.id)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header Section with Impact Metrics */}
      <section className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-green-600">
            FARMFEED
          </h1>
          <p className="text-xl text-muted-foreground">
            Empowering farmers to fight hunger through surplus crop donation
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold">{(impactMetrics.cropsRescued/1000).toFixed(1)}T</p>
            <p className="text-sm text-muted-foreground">Crops Rescued</p>
          </div>
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold">{(impactMetrics.mealsEnabled/1000).toFixed(1)}K</p>
            <p className="text-sm text-muted-foreground">Meals Enabled</p>
          </div>
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold">{(impactMetrics.organicWasteRepurposed/1000).toFixed(1)}T</p>
            <p className="text-sm text-muted-foreground">Waste Repurposed</p>
          </div>
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold">{(impactMetrics.feedCoinsDistributed/1000).toFixed(1)}K</p>
            <p className="text-sm text-muted-foreground">FeedCoins Given</p>
          </div>
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold">{impactMetrics.activeFarmers}</p>
            <p className="text-sm text-muted-foreground">Active Farmers</p>
          </div>
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-bold">{impactMetrics.activeNGOs}</p>
            <p className="text-sm text-muted-foreground">Partner NGOs</p>
          </div>
        </motion.div>

        <Button 
          size="lg" 
          className="bg-green-600 hover:bg-green-700 text-white px-8"
          onClick={() => setActiveTab("donate")}
        >
          Flag Surplus Crops
        </Button>
      </section>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8 w-full max-w-md mx-auto">
          <TabsTrigger value="farmfeed">Active Farmers</TabsTrigger>
          <TabsTrigger value="donate">Donate Crops</TabsTrigger>
          <TabsTrigger value="manure">Bio-Manure</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedFarmer}>Farmer Details</TabsTrigger>
        </TabsList>

        {/* Active Farmers Dashboard */}
        <TabsContent value="farmfeed" className="space-y-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
              <Select value={cropFilter} onValueChange={setCropFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="tomatoes">Tomatoes</SelectItem>
                  <SelectItem value="potatoes">Potatoes</SelectItem>
                  <SelectItem value="chilies">Chilies</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
                <Leaf className="mr-1 h-3 w-3" /> {filteredFarmers.length} Active Farmers
              </Badge>
            </div>
          </div>

          {filteredFarmers.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No active farmers match your filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFarmers.map((farmer) => renderFarmerCard(farmer))}
            </div>
          )}
        </TabsContent>

        {/* Donate Crops Form */}
        <TabsContent value="donate" className="space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Flag Your Surplus Crops</CardTitle>
              <CardDescription>
                Help fight hunger by donating your excess crops or selling at subsidized rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Crop Type*</label>
                    <Select 
                      value={formData.cropType}
                      onValueChange={(value) => setFormData({...formData, cropType: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tomatoes">Tomatoes</SelectItem>
                        <SelectItem value="potatoes">Potatoes</SelectItem>
                        <SelectItem value="onions">Onions</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="pulses">Pulses</SelectItem>
                        <SelectItem value="vegetables">Mixed Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity (kg)*</label>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Harvest Date*</label>
                    <Input 
                      type="date" 
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Donation Type*</label>
                    <Select 
                      value={formData.donationType}
                      onValueChange={(value) => setFormData({...formData, donationType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donation">Free Donation</SelectItem>
                        <SelectItem value="subsidized">Subsidized Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.donationType === "subsidized" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price per kg (₹)</label>
                      <Input 
                        type="number" 
                        placeholder="Enter price" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Window</label>
                    <Select 
                      value={formData.pickupWindow}
                      onValueChange={(value) => setFormData({...formData, pickupWindow: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pickup window" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM-4PM)</SelectItem>
                        <SelectItem value="evening">Evening (4PM-8PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      placeholder="Enter pickup location" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium">Additional Description</label>
                    <Input 
                      placeholder="Any special notes about your donation" 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                >
                  Submit Crop Donation
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center gap-8 text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1 text-amber-500" />
                <span>Earn FeedCoins</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>NGO Matchmaking</span>
              </div>
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-1" />
                <span>Bio-Manure Access</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Bio-Manure Options */}
        <TabsContent value="manure" className="space-y-6">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Complete the Circle: Organic Manure</CardTitle>
              <CardDescription>
                Turn food waste into valuable organic inputs for your farm through our circular ecosystem
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bioManureOptions.map((manure) => (
              <Card key={manure.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={manure.image} 
                    alt={manure.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{manure.name}</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-600">
                    {manure.price}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{manure.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Contents:</span>
                      <span>{manure.content}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Quantity:</span>
                      <span>{manure.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Best for:</span>
                      <span>{manure.suitable}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleManureRequest(manure.id)}
                  >
                    Request Manure
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Register Your Community Composting Facility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-green-700">
                If you have a biogas plant, community composting facility, or any other organic waste processing unit, register it to receive regular organic waste from our network.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Register Facility
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farmer Details */}
        <TabsContent value="details" className="space-y-6">
          {farmerDetails && (
            <>
              <Button 
                variant="ghost" 
                className="mb-4" 
                onClick={handleBackToFarmers}
              >
                ← Back to Farmers
              </Button>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <div className="h-64 w-full overflow-hidden">
                      <img 
                        src={farmerDetails.image} 
                        alt={farmerDetails.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2 bg-green-100 text-green-600 hover:bg-green-200 border-green-200">
                            {farmerDetails.cropType}
                          </Badge>
                          <CardTitle>{farmerDetails.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className={
                          farmerDetails.status === "Available" 
                            ? "bg-green-50 text-green-600" 
                            : farmerDetails.status === "Matched" 
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-50 text-gray-600"
                        }>
                          {farmerDetails.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{farmerDetails.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{farmerDetails.quantity}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Harvest: {new Date(farmerDetails.harvestDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-md">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Database className="h-4 w-4 mr-2 text-green-600" />
                          Crop Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{farmerDetails.cropType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium">{farmerDetails.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Donation Type:</span>
                            <span className="font-medium">{farmerDetails.donationType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">FeedCoins Earned:</span>
                            <span className="font-medium">{farmerDetails.feedCoinsEarned} FC</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Donation Impact</h4>
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                          <div className="flex items-center">
                            <Utensils className="h-4 w-4 mr-1 text-blue-500" />
                            <span>~2,000 meals provided</span>
                          </div>
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-1 text-amber-500" />
                            <span>{farmerDetails.feedCoinsEarned} FeedCoins earned</span>
                          </div>
                          <div className="flex items-center">
                            <Trash className="h-4 w-4 mr-1 text-green-500" />
                            <span>0 kg wasted</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Previous Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-3 border rounded-md">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">April 12, 2025</p>
                            <p className="text-sm text-muted-foreground">250 kg Onions donated to Helping Hands NGO</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 border rounded-md">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">March 22, 2025</p>
                            <p className="text-sm text-muted-foreground">150 kg Potatoes sold at subsidized rate to Food Bank</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 border rounded-md">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">February 5, 2025</p>
                            <p className="text-sm text-muted-foreground">300 kg Mixed Vegetables donated to Community Kitchen</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="bg-green-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-green-700">Request Pickup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantity (kg)*</label>
                        <Input 
                          type="number" 
                          placeholder="Enter quantity" 
                          value={donationQuantity}
                          onChange={(e) => setDonationQuantity(e.target.value)}
                          className="border-green-200 focus:border-green-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pickup Date*</label>
                        <Input 
                          type="date"
                          className="border-green-200 focus:border-green-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pickup Window</label>
                        <Select>
                          <SelectTrigger className="border-green-200 focus:border-green-400">
                            <SelectValue placeholder="Select pickup window" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12PM-4PM)</SelectItem>
                            <SelectItem value="evening">Evening (4PM-8PM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => toast.success("Pickup request sent successfully!")}
                      >
                        Request Pickup
                      </Button>
                      
                      <div className="text-center text-sm text-green-700">
                        You'll be notified once the farmer confirms the pickup
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Farmer Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-amber-100 text-amber-700 py-1 px-2">Top Donor</Badge>
                        <Badge className="bg-green-100 text-green-700 py-1 px-2">Bio-Friendly</Badge>
                        <Badge className="bg-blue-100 text-blue-700 py-1 px-2">Community Champion</Badge>
                        <Badge className="bg-purple-100 text-purple-700 py-1 px-2">Sustainable Farmer</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">
                        Contact details are shown only to verified NGOs and volunteers. 
                        Please authenticate as a verified partner to view contact information.
                      </p>
                      <Button variant="outline" className="w-full">
                        Request Contact Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmFeedPage;
