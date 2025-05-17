
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FoodFlagGrid } from "@/components/FoodFlagGrid";
import { mockFoodFlags, impactStats } from "@/data/mockData";
import { MapPin, Users, Award, ArrowRight, TrendingUp, Heart, ShieldCheck, Bell } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import FrameworkSection from "@/components/FrameworkSection";

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("nearby");
  
  const nearbyFlags = mockFoodFlags.slice(0, 3);
  const trendingFlags = [...mockFoodFlags].reverse().slice(0, 3);
  
  const impactMetrics = [
    {
      icon: Heart,
      label: "Meals Donated",
      value: formatNumber(impactStats.mealsDonated),
      description: "Nutritious meals provided to those in need through our platform"
    },
    {
      icon: TrendingUp,
      label: "CO₂ Prevented",
      value: formatNumber(impactStats.co2Prevented) + "kg",
      description: "Reduction in carbon emissions by preventing food waste"
    },
    {
      icon: Users,
      label: "Active Donors",
      value: formatNumber(impactStats.activeDonors),
      description: "Dedicated food donors making a difference in their communities"
    }
  ];

  const feasibilityCards = [
    {
      title: "Easy Integration",
      description: "Simple onboarding process for both donors and recipients",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
    },
    {
      title: "Real-time Updates",
      description: "Instant notifications and live tracking of food donations",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    {
      title: "Community Impact",
      description: "Measurable reduction in food waste and hunger",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ff-green/10 to-ff-orange/10 -z-10" />
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
              Rescuing Food,<br />
              <span className="gradient-text">Feeding Communities</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in" style={{animationDelay: "0.2s"}}>
              Connect surplus food with those in need while earning rewards for your positive impact on the community and environment.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
              <Button asChild className="btn-gradient" size="lg">
                <Link to="/donate">Donate Food</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/map">Find Food</Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="w-full h-[400px] md:h-[500px] relative">
              <div className="absolute top-0 right-0 w-[90%] h-[90%] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://img.freepik.com/premium-photo/happy-indian-children-enjoy-food-bread-dirty-crowded-streets-social-problem-poverty-hunger-lack-clean-drinking-water_184982-5918.jpg"
                  alt="Food donation app"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">FoodFlag System</h3>
                    <p className="text-sm opacity-90">Connect donors with recipients in real-time</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-[60%] h-[40%] bg-white rounded-2xl overflow-hidden shadow-lg border p-4 z-10 bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-green-500">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-ff-green/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-ff-green" />
                  </div>
                  <div>
                    <h4 className="font-medium">Rewards & Impact</h4>
                    <p className="text-m text-muted-foreground">Earn FeedCoins for your contributions</p>
                    <p className="text-m text-muted-foreground">A plate of food may seem small to you, but to someone hungry, it's a message that they are seen, loved, and not forgotten.</p>
                    
                    <p className="text-m text-muted-foreground">Donate food and earn rewards for your positive impact on the community and environment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section with Hover Cards */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Community Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactMetrics.map((metric, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <metric.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-1">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{metric.label}</h4>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Food Flags Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold">Available Food</h2>
              <p className="text-muted-foreground">Browse surplus food that needs rescuing near you</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="nearby" className="mt-0">
                <FoodFlagGrid foodFlags={nearbyFlags} />
              </TabsContent>
              
              <TabsContent value="trending" className="mt-0">
                <FoodFlagGrid foodFlags={trendingFlags} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="group">
              <Link to="/map">
                View All Available Food
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Framework Section */}
      <FrameworkSection />
      
      {/* How It Works */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Our platform connects food donors with recipients through an easy-to-use system
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">1. Create a FoodFlag</h3>
                <p className="text-sm text-muted-foreground">
                  Donors post details about surplus food including type, quantity, and pickup location.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">2. Connect with Recipients</h3>
                <p className="text-sm text-muted-foreground">
                  Recipients are notified of nearby available food and can claim it for pickup.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">3. Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Both donors and recipients earn FeedCoins that can be redeemed for various rewards.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="btn-gradient">
              <Link to="/about">Learn More About Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Platform Features</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Project FeedForward combines innovative technology with social impact
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Blockchain Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Immutable records of all donations for complete transparency and trust.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">GPS Navigation</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time directions to pickup locations for efficient food rescue.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">FeedCoin Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn tokens for your contributions and redeem them for various perks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Real-time Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified instantly when food is available in your area.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Community Governance</h3>
                    <p className="text-sm text-muted-foreground">
                      Participate in platform decisions through our DAO structure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Impact Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor your environmental and social impact with detailed metrics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
