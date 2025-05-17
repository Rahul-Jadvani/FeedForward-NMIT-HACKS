
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
  const { isEditingLayout, setIsEditingLayout } = useTheme();
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

  const shuffleItems = () => {
    setAnimatingItems(true);
    
    // Clone the array to avoid mutating the state directly
    const newItems = [...gridItems];
    
    // Fisher-Yates shuffle algorithm
    for (let i = newItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
    }
    
    setTimeout(() => {
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
      setGridItems(items);
      localStorage.removeItem('bentoLayout');
      setAnimatingItems(false);
      setIsEditingLayout(false);
      toast.success("Layout reset to default!", {
        icon: <RotateCcw className="h-4 w-4" />
      });
    }, 300);
  };
  
  // Function to get vibrant color class based on theme
  const getVibrantColor = (baseColor: string, index: number) => {
    const vibrantColors = [
      "bg-gradient-to-br from-pink-400/20 to-purple-500/20",
      "bg-gradient-to-br from-green-400/20 to-blue-500/20",
      "bg-gradient-to-br from-yellow-400/20 to-orange-500/20",
      "bg-gradient-to-br from-indigo-400/20 to-cyan-500/20",
      "bg-gradient-to-br from-red-400/20 to-yellow-500/20",
      "bg-gradient-to-br from-teal-400/20 to-blue-500/20",
      "bg-gradient-to-br from-fuchsia-400/20 to-rose-500/20",
      "bg-gradient-to-br from-amber-400/20 to-orange-500/20",
      "bg-gradient-to-br from-sky-400/20 to-indigo-500/20",
      "bg-gradient-to-br from-lime-400/20 to-emerald-500/20",
      "bg-gradient-to-br from-violet-400/20 to-purple-500/20",
      "bg-gradient-to-br from-rose-400/20 to-pink-500/20",
    ];
    
    return vibrantColors[index % vibrantColors.length];
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
          const vibrantColor = getVibrantColor(item.color, index);
          
          return isEditingLayout ? (
            <div 
              key={item.id}
              className={`bento-item ${sizeClass} ${vibrantColor} backdrop-blur-lg border border-white/20 rounded-xl p-6 
                ${animatingItems ? 'animate-bounce-in' : isInitialLoad ? 'opacity-0' : 'animate-slide-up-fade'}
                ${isEditingLayout ? 'cursor-move border-dashed border-2 hover:border-white/60' : ''}`}
              style={{ animationDelay }}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bento-item-icon h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
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
              key={item.id}
              to={item.to}
              className={`bento-item ${sizeClass} ${vibrantColor} backdrop-blur-lg border border-white/10 rounded-xl p-6 
                flex flex-col group
                ${animatingItems ? 'animate-bounce-in' : isInitialLoad ? 'opacity-0' : 'animate-slide-up-fade'}`}
              style={{ animationDelay }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bento-item-icon h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
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
