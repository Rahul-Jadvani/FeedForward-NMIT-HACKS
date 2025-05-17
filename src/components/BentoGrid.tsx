
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Gift,
  Users,
  Award,
  Database,
  Bot,
  FileCheck,
  AlertTriangle,
  Compass,
  ShoppingCart,
  BarChart4,
  User,
} from "lucide-react";

interface BentoItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
}

const BentoItem: React.FC<BentoItemProps> = ({ title, description, icon, to, className }) => {
  return (
    <Link to={to} className={cn("bento-item group", className)}>
      <div className="bento-item-icon text-ff-blue group-hover:text-white">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-1 text-ff-blue group-hover:text-white">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </Link>
  );
};

export function BentoGrid() {
  const bentoItems = [
    {
      title: "FOOD MAP",
      description: "Find and claim available food donations nearby on our interactive map",
      icon: <MapPin className="h-6 w-6" />,
      to: "/map",
      className: "bento-item-wide",
    },
    {
      title: "DONATE FOOD",
      description: "Create a FoodFlag to share your surplus food",
      icon: <Gift className="h-6 w-6" />,
      to: "/donate",
    },
    {
      title: "COMMUNITY IMPACT",
      description: "See how Feed Forward is making a difference in your community",
      icon: <Users className="h-6 w-6" />,
      to: "/impact",
    },
    {
      title: "AI INVENTORY",
      description: "AI-powered inventory management for your surplus food",
      icon: <Database className="h-6 w-6" />,
      to: "/ai-inventory",
    },
    {
      title: "ANNAPOORNA CHATBOT",
      description: "Get assistance and answers to your questions",
      icon: <Bot className="h-6 w-6" />,
      to: "/annapoorna-chatbot",
    },
    {
      title: "AI ORDER VERIFICATION",
      description: "Verify food quality and quantity with AI assistance",
      icon: <FileCheck className="h-6 w-6" />,
      to: "/ai-order-verification",
    },
    {
      title: "VOLUNTEER",
      description: "Join our volunteer network to help deliver food",
      icon: <Award className="h-6 w-6" />,
      to: "/volunteer",
    },
    {
      title: "EXPLORE",
      description: "Discover food rescue stories and community impact",
      icon: <Compass className="h-6 w-6" />,
      to: "/explore",
    },
    {
      title: "SANJEEVANI",
      description: "Emergency food distribution during disasters",
      icon: <AlertTriangle className="h-6 w-6" />,
      to: "/sanjeevani",
      className: "border-red-500/30 group-hover:border-red-500/60",
    },
    {
      title: "ECO-MARKETPLACE",
      description: "Redeem your FeedCoins for rewards and perks",
      icon: <ShoppingCart className="h-6 w-6" />,
      to: "/eco-marketplace",
    },
    {
      title: "CSR DASHBOARD",
      description: "Corporate Social Responsibility tracking and reports",
      icon: <BarChart4 className="h-6 w-6" />,
      to: "/csr-dashboard",
    },
    {
      title: "PROFILE",
      description: "View and manage your personal profile and preferences",
      icon: <User className="h-6 w-6" />,
      to: "/profile",
    },
  ];

  return (
    <div className="bento-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {bentoItems.map((item, index) => (
        <BentoItem
          key={index}
          title={item.title}
          description={item.description}
          icon={item.icon}
          to={item.to}
          className={cn(
            {"animate-fade-in": true},
            {"delay-[100ms]": index % 3 === 0},
            {"delay-[200ms]": index % 3 === 1},
            {"delay-[300ms]": index % 3 === 2},
            item.className
          )}
        />
      ))}
    </div>
  );
}
