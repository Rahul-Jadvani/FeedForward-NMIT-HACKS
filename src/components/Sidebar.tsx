
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Home, MapPin, Heart, BarChart, ChevronLeft, ChevronRight, Info, Users, User, Database, Globe, Bot, FileCheck, BarChart4, ShoppingCart, AlertTriangle } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: MapPin, label: "Food Map", to: "/map" },
  { icon: Heart, label: "Donate Food", to: "/donate" },
  { icon: Database, label: "AI Inventory", to: "/ai-inventory" },
  { icon: Users, label: "Volunteer", to: "/volunteer" },
  { icon: Globe, label: "Explore", to: "/explore" },
  { icon: BarChart, label: "Community Impact", to: "/impact" },
  { icon: Bot, label: "Annapoorna Chatbot", to: "/annapoorna-chatbot" },
  { icon: FileCheck, label: "AI Order Verification", to: "/ai-order-verification" },
  { icon: AlertTriangle, label: "Sanjeevani", to: "/sanjeevani", special: true },
  { icon: ShoppingCart, label: "Eco-Marketplace", to: "/eco-marketplace" },
  { icon: BarChart4, label: "CSR Dashboard", to: "/csr-dashboard" },
  { icon: User, label: "Profile", to: "/profile" },
  { icon: Info, label: "About", to: "/about" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-[calc(100vh-4rem)] sticky top-16 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      collapsed ? "w-16" : "w-[240px]",
      "transition-all duration-300"
    )}>
      <div className="flex flex-col h-full p-2">
        <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                collapsed && "justify-center",
                item.special && "text-white text-red-500 "
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        <Button
          variant="ghost"
          size="icon"
          className="self-end mt-4"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </div>
  );
}
