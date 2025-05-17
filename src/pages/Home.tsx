
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Heart, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  User, 
  Database, 
  Globe, 
  Bot, 
  FileCheck, 
  BarChart4, 
  ShoppingCart, 
  AlertTriangle,
  Gift,
  MessageSquare,
  CheckCircle,
  BarChart
} from "lucide-react";

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
  const bentoItems = [
    {
      id: "food-map",
      title: "FOOD MAP",
      description: "FIND AND CLAIM AVAILABLE FOOD DONATIONS NEARBY ON OUR INTERACTIVE MAP",
      icon: <MapPin className="h-6 w-6" />,
      to: "/map",
      size: "large",
      color: "bg-indigo-100/20"
    },
    {
      id: "donate-food",
      title: "DONATE FOOD",
      description: "CREATE A FOODFLAG TO SHARE YOUR SURPLUS FOOD",
      icon: <Gift className="h-6 w-6" />,
      to: "/donate",
      size: "small",
      color: "bg-green-100/20"
    },
    {
      id: "community-impact",
      title: "COMMUNITY IMPACT",
      description: "SEE HOW FEED FORWARD IS MAKING A DIFFERENCE IN YOUR COMMUNITY",
      icon: <Users className="h-6 w-6" />,
      to: "/impact",
      size: "small",
      color: "bg-blue-100/20"
    },
    {
      id: "ai-inventory",
      title: "AI INVENTORY",
      description: "AI-POWERED INVENTORY MANAGEMENT FOR YOUR SURPLUS FOOD",
      icon: <Database className="h-6 w-6" />,
      to: "/ai-inventory",
      size: "small",
      color: "bg-yellow-100/20"
    },
    {
      id: "annapoorna-chatbot",
      title: "ANNAPOORNA CHATBOT",
      description: "GET ASSISTANCE AND ANSWERS TO YOUR QUESTIONS",
      icon: <MessageSquare className="h-6 w-6" />,
      to: "/annapoorna-chatbot",
      size: "small",
      color: "bg-purple-100/20"
    },
    {
      id: "ai-order-verification",
      title: "AI ORDER VERIFICATION",
      description: "VERIFY FOOD QUALITY AND QUANTITY WITH AI ASSISTANCE",
      icon: <CheckCircle className="h-6 w-6" />,
      to: "/ai-order-verification",
      size: "small",
      color: "bg-green-100/20"
    },
    {
      id: "volunteer",
      title: "VOLUNTEER",
      description: "JOIN OUR VOLUNTEER NETWORK TO HELP DELIVER FOOD",
      icon: <Users className="h-6 w-6" />,
      to: "/volunteer",
      size: "medium",
      color: "bg-blue-100/20"
    },
    {
      id: "explore",
      title: "EXPLORE",
      description: "DISCOVER FOOD RESCUE STORIES AND COMMUNITY IMPACT",
      icon: <Globe className="h-6 w-6" />,
      to: "/explore",
      size: "small",
      color: "bg-indigo-100/20"
    },
    {
      id: "marketplace",
      title: "MARKETPLACE",
      description: "REDEEM YOUR FEEDCOINS FOR REWARDS AND PERKS",
      icon: <ShoppingCart className="h-6 w-6" />,
      to: "/eco-marketplace",
      size: "small",
      color: "bg-orange-100/20"
    },
    {
      id: "sanjeevani",
      title: "SANJEEVANI",
      description: "EMERGENCY FOOD DISTRIBUTION DURING DISASTERS",
      icon: <AlertTriangle className="h-6 w-6" />,
      to: "/sanjeevani",
      size: "small",
      color: "bg-red-100/20"
    },
    {
      id: "csr-dashboard",
      title: "CSR DASHBOARD",
      description: "CORPORATE SOCIAL RESPONSIBILITY TRACKING AND REPORTS",
      icon: <BarChart4 className="h-6 w-6" />,
      to: "/csr-dashboard",
      size: "small",
      color: "bg-teal-100/20"
    },
    {
      id: "profile",
      title: "PROFILE",
      description: "VIEW AND MANAGE YOUR PERSONAL PROFILE AND PREFERENCES",
      icon: <User className="h-6 w-6" />,
      to: "/profile",
      size: "small",
      color: "bg-gray-100/20"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bento Grid Navigation */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {bentoItems.map(item => {
            // Define grid span classes based on size
            const sizeClass = 
              item.size === "large" ? "md:col-span-2 md:row-span-2" : 
              item.size === "medium" ? "md:col-span-2" : 
              "";
            
            return (
              <Link 
                key={item.id}
                to={item.to} 
                className={`${sizeClass} ${item.color} backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-sm md:text-base uppercase">{item.title}</h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 uppercase">
                  {item.description}
                </p>

                {item.size === "large" && (
                  <div className="mt-auto pt-4 flex items-center justify-end">
                    <span className="text-sm flex items-center gap-1">
                      View <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
