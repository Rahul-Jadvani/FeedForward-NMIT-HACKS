
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Home, MapPin, Heart, BarChart, ChevronLeft, ChevronRight, Info, Users, User, Database, Globe, Bot, FileCheck, BarChart4, ShoppingCart, Tractor, Coins } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

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
  { icon: Tractor, label: "FarmFeed", to: "/farmfeed", special: true },
  { icon: ShoppingCart, label: "Eco-Marketplace", to: "/eco-marketplace" },
  { icon: BarChart4, label: "CSR Dashboard", to: "/csr-dashboard" },
  { icon: Coins, label: "FeedCoin Wallet", to: "/wallet" },
  { icon: User, label: "Profile", to: "/profile" },
  { icon: Info, label: "About", to: "/about" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [hoverState, setHoverState] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const handleMouseEnter = () => {
    setHoverState(true);
    if (collapsed) setCollapsed(false);
  };
  
  const handleMouseLeave = () => {
    setHoverState(false);
    if (!collapsed) setCollapsed(true);
  };

  // Handle click outside to collapse sidebar when on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Only collapse on mobile when sidebar is expanded
        if (window.innerWidth < 768 && !collapsed) {
          setCollapsed(true);
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed]);

  // Use appropriate background color based on theme
  const sidebarBgClass = theme === 'dark' 
    ? "bg-theme-dark/90 backdrop-blur-md" 
    : "bg-background/80 backdrop-blur-md border-gray-200";

  // Use appropriate text color based on theme  
  const textColorClass = theme === 'dark'
    ? "text-white/70" 
    : "text-foreground/70";
  
  const activeTextColorClass = theme === 'dark'
    ? "text-white" 
    : "text-foreground";

  const hoverBgClass = theme === 'dark'
    ? "hover:bg-white/10" 
    : "hover:bg-black/5";

  const activeBgClass = theme === 'dark'
    ? "bg-white/20" 
    : "bg-black/10";

  return (
    <>
      {/* Hover detection zone */}
      <div 
        ref={hoverZoneRef}
        className="fixed left-0 top-16 w-6 h-[calc(100vh-4rem)] z-30"
        onMouseEnter={handleMouseEnter}
      />
      
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] shadow-lg z-40",
          sidebarBgClass,
          "transition-all duration-300 ease-in-out",
          theme === 'dark' ? "border-r border-white/10" : "border-r border-gray-200",
          collapsed ? "w-16 -translate-x-16 md:translate-x-0" : "w-[240px]",
          hoverState && collapsed && "translate-x-0"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full p-2">
          <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-none">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  hoverBgClass, 
                  isActive ? activeBgClass : "",
                  isActive ? activeTextColorClass : textColorClass,
                  collapsed && "justify-center",
                  item.special && "text-red-500",
                  "text-lg" // Increased font size
                )}
              >
                <item.icon size={22} /> {/* Slightly increased icon size */}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          
          <Button
            variant="ghost"
            size="icon"
            className={`self-end mt-4 ${textColorClass} ${hoverBgClass}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
      </div>
    </>
  );
}
