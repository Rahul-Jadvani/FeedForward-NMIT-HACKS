
import { Link, useLocation } from "react-router-dom";
import { MapPin, Award, ShoppingBag, BarChart, Bot, FileCheck, Globe, Database, BarChart4, Tractor, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  protected?: boolean;
  badge?: string;
}

export const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Food Map", href: "/map", icon: <MapPin className="h-4 w-4" /> },
  { title: "Donate Food", href: "/donate" },
  { title: "Farmer Donations", href: "/farmer-donations", icon: <Sprout className="h-4 w-4" />, badge: "New" },
  { title: "AI Inventory", href: "/ai-inventory", icon: <Database className="h-4 w-4" /> },
  { title: "Volunteer", href: "/volunteer", icon: <Award className="h-4 w-4" /> },
  { title: "Explore", href: "/explore", icon: <Globe className="h-4 w-4" /> },
  { 
    title: "Community Impact", 
    href: "/impact", 
    icon: <BarChart className="h-4 w-4" />,
  },
  { 
    title: "Chatbot", 
    href: "/annapoorna-chatbot", 
    icon: <Bot className="h-4 w-4" />,
    badge: "AI"
  },
  {
    title: "FarmFeed",
    href: "/farmfeed",
    icon: <Tractor className="h-4 w-4" />,
    badge: "New"
  },
  { 
    title: "AI Verification", 
    href: "/ai-order-verification", 
    icon: <FileCheck className="h-4 w-4" />,
    badge: "New"
  },
  { 
    title: "CSR Dashboard", 
    href: "/csr-dashboard", 
    icon: <BarChart4 className="h-4 w-4" />,
    badge: "New"
  },
];

export function NavLinks() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Get only the visible nav items based on authentication status
  const visibleNavItems = navItems.filter(item => !item.protected || isAuthenticated);

  return (
    <div className="hidden md:flex gap-6">
      {visibleNavItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-all relative",
              isActive 
                ? "text-primary" 
                : "hover:text-primary hover:scale-105"
            )}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.title}
            
            {/* Active indicator */}
            {isActive && (
              <span className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-primary" />
            )}
            
            {/* Badge for new features */}
            {item.badge && (
              <Badge 
                variant="outline" 
                className={cn(
                  "ml-1.5 py-0 px-1.5 h-4 text-[10px] bg-ff-orange text-white border-ff-orange",
                  hoveredItem === item.href || isActive ? "animate-pulse" : ""
                )}
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );
}
