
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shuffle, Save, RotateCcw, ArrowRight } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";
import { toast } from "sonner";

type BentoItem = {
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
      toast.success("Items shuffled successfully!");
    }, 300);
  };

  const saveLayout = () => {
    localStorage.setItem('bentoLayout', JSON.stringify(gridItems));
    toast.success("Layout saved successfully!");
  };

  const resetLayout = () => {
    setAnimatingItems(true);
    setTimeout(() => {
      setGridItems(items);
      localStorage.removeItem('bentoLayout');
      setAnimatingItems(false);
      toast.success("Layout reset to default!");
    }, 300);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <Button 
          onClick={shuffleItems} 
          className="btn-gradient gap-2 animate-fade-in" 
          disabled={animatingItems}
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
        <Button 
          onClick={saveLayout} 
          variant="secondary" 
          className="gap-2 animate-fade-in" 
          style={{animationDelay: "0.1s"}}
          disabled={animatingItems}
        >
          <Save className="h-4 w-4" />
          Save Layout
        </Button>
        <Button 
          onClick={resetLayout} 
          variant="outline" 
          className="gap-2 animate-fade-in" 
          style={{animationDelay: "0.2s"}}
          disabled={animatingItems}
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
          
          const animationDelay = `${index * 0.05}s`;
          
          return (
            <Link 
              key={item.id}
              to={item.to}
              className={`${sizeClass} ${item.color} backdrop-blur-lg border border-white/10 rounded-xl p-6 
                hover:border-white/30 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col
                ${animatingItems ? 'animate-bounce-in' : 'animate-slide-up-fade'}`}
              style={{ animationDelay }}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
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
                    View <ArrowRight className="h-4 w-4" />
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
