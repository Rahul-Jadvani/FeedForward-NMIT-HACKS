
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shuffle, Save, RotateCcw, ArrowRight, Edit, Move } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

export type BentoItem = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  to: string;
  size: "large" | "medium" | "small";
  color: string;
};

interface BentoGridProps {
  items: BentoItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  const [gridItems, setGridItems] = useState<BentoItem[]>(items);
  const [animatingItems, setAnimatingItems] = useState<boolean>(false);
  const { isEditingLayout, setIsEditingLayout, theme } = useTheme();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('bentoLayout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        // Ensure we have all current items (in case items were added/removed since last save)
        const currentIds = items.map(item => item.id);
        const savedIds = parsedLayout.map((item: BentoItem) => item.id);
        
        // Only use saved layout if all current items exist in it
        const allItemsExist = currentIds.every(id => savedIds.includes(id));
        
        if (allItemsExist && savedIds.length === currentIds.length) {
          setGridItems(parsedLayout);
        }
      } catch (err) {
        console.error("Error loading saved layout:", err);
      }
    } else {
      // Optimize layout if no saved layout
      optimizeLayout(items);
    }
    
    // Set initial load to false after a short delay to trigger entrance animations
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [items]);

  const { handleDragStart, handleDragEnter, handleDragEnd } = useDraggable({
    items: gridItems,
    setItems: setGridItems,
  });

  // Function to optimize layout and avoid empty spaces
  const optimizeLayout = (itemsToOptimize: BentoItem[]) => {
    // Create a copy to avoid direct mutation
    const newItems = [...itemsToOptimize];
    
    // First, sort by size to place larger items first
    newItems.sort((a, b) => {
      const sizeOrder = { large: 3, medium: 2, small: 1 };
      return sizeOrder[b.size as keyof typeof sizeOrder] - sizeOrder[a.size as keyof typeof sizeOrder];
    });
    
    setGridItems(newItems);
  };

  const shuffleItems = () => {
    setAnimatingItems(true);
    
    // Clone the array to avoid mutating the state directly
    const newItems = [...gridItems];
    
    // Fisher-Yates shuffle algorithm - enhanced to be more random
    for (let i = newItems.length - 1; i > 0; i--) {
      // Generate a more random index by using crypto if available
      const getRandomIndex = () => {
        if (window.crypto && window.crypto.getRandomValues) {
          const randomBuffer = new Uint32Array(1);
          window.crypto.getRandomValues(randomBuffer);
          return randomBuffer[0] % (i + 1);
        }
        return Math.floor(Math.random() * (i + 1));
      };
      
      const j = getRandomIndex();
      [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
    }
    
    setTimeout(() => {
      // Set the shuffled items without optimizing - true random shuffle
      setGridItems(newItems);
      setAnimatingItems(false);
      toast.success("Items shuffled successfully!", {
        icon: <Shuffle className="h-4 w-4" />
      });
    }, 300);
  };

  const toggleEditLayout = () => {
    if (isEditingLayout) {
      localStorage.setItem('bentoLayout', JSON.stringify(gridItems));
      toast.success("Layout saved successfully!", {
        icon: <Save className="h-4 w-4" />
      });
    } else {
      toast.info("Drag items to rearrange your layout", {
        icon: <Move className="h-4 w-4" />
      });
    }
    setIsEditingLayout(!isEditingLayout);
  };

  const resetLayout = () => {
    setAnimatingItems(true);
    setTimeout(() => {
      // Reset and optimize original layout
      optimizeLayout(items);
      localStorage.removeItem('bentoLayout');
      setAnimatingItems(false);
      setIsEditingLayout(false);
      toast.success("Layout reset to default!", {
        icon: <RotateCcw className="h-4 w-4" />
      });
    }, 300);
  };
  
  // Function to get color class based on theme and index - Updated with more vibrant Google-like colors
  const getItemColorClass = (index: number) => {
    // Bright and lively colors for light mode (Google-inspired)
    const lightModeColors = [
      "bg-[#F97316]/70", // Bright Orange
      "bg-[#33C3F0]/70", // Sky Blue
      "bg-[#1EAEDB]/70", // Bright Blue
      "bg-[#D946EF]/70", // Magenta Pink
      "bg-[#8B5CF6]/70", // Vivid Purple
      "bg-[#F2FCE2]", // Soft Green
      "bg-[#FEF7CD]", // Soft Yellow
      "bg-[#FFDEE2]", // Soft Pink
      "bg-[#D3E4FD]", // Soft Blue
      "bg-amber-200", // Light Amber
      "bg-emerald-200", // Light Emerald
      "bg-cyan-200", // Light Cyan
    ];
    
    // Dark mode vibrant colors with gradient backgrounds
    const darkModeColors = [
      "bg-gradient-to-br from-pink-500/30 to-purple-600/30",
      "bg-gradient-to-br from-blue-500/30 to-teal-400/30",
      "bg-gradient-to-br from-orange-400/30 to-amber-500/30",
      "bg-gradient-to-br from-indigo-500/30 to-blue-400/30",
      "bg-gradient-to-br from-violet-500/30 to-purple-400/30",
      "bg-gradient-to-br from-green-400/30 to-emerald-500/30",
      "bg-gradient-to-br from-rose-400/30 to-pink-500/30",
      "bg-gradient-to-br from-cyan-500/30 to-blue-400/30",
      "bg-gradient-to-br from-yellow-400/30 to-amber-500/30",
      "bg-gradient-to-br from-teal-400/30 to-green-500/30",
      "bg-gradient-to-br from-fuchsia-500/30 to-pink-600/30",
      "bg-gradient-to-br from-amber-400/30 to-orange-500/30",
    ];
    
    return theme === 'dark' ? darkModeColors[index % darkModeColors.length] : lightModeColors[index % lightModeColors.length];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <Button 
          onClick={shuffleItems} 
          className="btn-gradient gap-2 animate-fade-in" 
          disabled={animatingItems || isEditingLayout}
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
        <Button 
          onClick={toggleEditLayout} 
          variant={isEditingLayout ? "secondary" : "secondary"}
          className={`gap-2 animate-fade-in ${isEditingLayout ? "bg-accent text-accent-foreground" : ""}`}
          style={{animationDelay: "0.1s"}}
          disabled={animatingItems}
        >
          {isEditingLayout ? (
            <>
              <Save className="h-4 w-4" />
              Save Layout
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit Layout
            </>
          )}
        </Button>
        <Button 
          onClick={resetLayout} 
          variant="outline" 
          className="gap-2 animate-fade-in" 
          style={{animationDelay: "0.2s"}}
          disabled={animatingItems || isEditingLayout}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {gridItems.map((item, index) => {
          // Define grid span classes based on size
          const sizeClass = 
            item.size === "large" ? "md:col-span-2 md:row-span-2" : 
            item.size === "medium" ? "md:col-span-2" : 
            "";
          
          // Calculate animation delay for staggered entrance
          const animationDelay = `${(index % 12) * 0.05 + 0.1}s`;
          const itemColorClass = getItemColorClass(index);
          
          // Border color based on theme
          const borderClass = theme === 'dark' 
            ? "border-white/10" 
            : "border-gray-200/80";
          
          return isEditingLayout ? (
            <div 
              key={item.id}
              className={`bento-item ${sizeClass} ${itemColorClass} backdrop-blur-sm border ${borderClass} rounded-xl p-6 
                ${animatingItems ? 'animate-bounce-in' : isInitialLoad ? 'opacity-0' : 'animate-slide-up-fade'}
                ${isEditingLayout ? 'cursor-move border-dashed border-2 hover:border-foreground/40' : ''}`}
              style={{ animationDelay }}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bento-item-icon h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  {isEditingLayout ? <Move className="h-6 w-6" /> : item.icon}
                </div>
                <h3 className="font-display font-medium text-sm md:text-base uppercase">{item.title}</h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2 uppercase font-medium">
                {item.description}
              </p>
            </div>
          ) : (
            <Link 
              key={item.to}
              to={item.to}
              className={`bento-item ${sizeClass} ${itemColorClass} backdrop-blur-sm border ${borderClass} rounded-xl p-6 
                flex flex-col group
                ${animatingItems ? 'animate-bounce-in' : isInitialLoad ? 'opacity-0' : 'animate-slide-up-fade'}`}
              style={{ animationDelay }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bento-item-icon h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-display font-medium text-sm md:text-base uppercase">{item.title}</h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2 uppercase font-medium">
                {item.description}
              </p>

              {item.size === "large" && (
                <div className="mt-auto pt-4 flex items-center justify-end">
                  <span className="text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                    View <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
