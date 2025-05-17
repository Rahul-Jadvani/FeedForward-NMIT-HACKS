
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Home, MapPin, Heart, BarChart, ChevronLeft, ChevronRight, Info, Users, User, Database, Globe, Bot, FileCheck, BarChart4, ShoppingCart, AlertTriangle } from "lucide-react";
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
  { icon: AlertTriangle, label: "Sanjeevani", to: "/sanjeevani", special: true },
  { icon: ShoppingCart, label: "Eco-Marketplace", to: "/eco-marketplace" },
  { icon: BarChart4, label: "CSR Dashboard", to: "/csr-dashboard" },
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

  // Always use dark background for sidebar, regardless of theme
  const sidebarBgClass = "bg-theme-dark/90 backdrop-blur-md";

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
          "border-r border-white/10",
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
                  "hover:bg-white/10 hover:text-white",
                  isActive ? "bg-white/20 text-white" : "text-white/70",
                  collapsed && "justify-center",
                  item.special && "text-white text-red-500 ",
                  "text-lg" // Increased font size
                )}
              >
                <item.icon size={22} /> {/* Slightly increased icon size */}
                {!collapsed && <span className="text-white">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          
          <Button
            variant="ghost"
            size="icon"
            className="self-end mt-4 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
      </div>
    </>
  );
}
