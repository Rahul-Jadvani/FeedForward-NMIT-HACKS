
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tractor } from "lucide-react";
import { useEffect, useState } from "react";

export function FarmFeedAlertButton() {
  const [isBlinking, setIsBlinking] = useState(true);
  
  // Blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Button
      asChild
      variant="outline"
      className={`bg-green-600 ${isBlinking ? 'animate-pulse' : ''}`}
    >
      <Link to="/farmfeed">
        <Tractor className="mr-2 h-4 w-4" />
        FARMFEED
      </Link>
    </Button>
  );
}
