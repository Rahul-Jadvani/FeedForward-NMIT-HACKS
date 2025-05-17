
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Info, Award } from "lucide-react";
import { Link } from "react-router-dom";

export interface FoodFlag {
  id: string;
  title: string;
  description: string;
  foodType: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Mixed";
  quantity: string;
  location: string;
  distance: string;
  expiryTime: string;
  postedTime: string;
  imageUrl: string;
  donorName: string;
  donorRating: number;
  organizationAddress: string; // Changed from optional to required
  impact: {
    mealsProvided: number;
    co2Saved: number;
  };
}

interface FoodFlagCardProps {
  foodFlag: FoodFlag;
  variant?: "default" | "compact";
  onClick?: () => void;
}

export function FoodFlagCard({ foodFlag, variant = "default", onClick }: FoodFlagCardProps) {
  const isCompact = variant === "compact";
  
  const getFoodTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Vegetarian":
        return "bg-ff-green text-white hover:bg-ff-green";
      case "Vegan":
        return "bg-emerald-600 text-white hover:bg-emerald-600";
      case "Non-Vegetarian":
        return "bg-ff-orange text-white hover:bg-ff-orange";
      default:
        return "bg-ff-yellow text-foreground hover:bg-ff-yellow";
    }
  };

  // Check if expiry is urgent (less than 3 hours)
  const isUrgent = foodFlag.expiryTime.includes("hour") && 
    parseInt(foodFlag.expiryTime.split(" ")[0]) <= 3;

  return (
    <Card 
      className={`overflow-hidden group transition-all duration-300 ${
        isCompact ? "" : "hover:shadow-lg"
      } animate-fade-in ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {!isCompact && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={foodFlag.imageUrl}
            alt={foodFlag.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Badge variant="secondary" className="font-medium">
              {foodFlag.quantity}
            </Badge>
            
            {isUrgent && (
              <Badge variant="destructive" className="animate-pulse">
                Urgent
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <CardHeader className={isCompact ? "p-4" : undefined}>
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={`${getFoodTypeBadgeColor(foodFlag.foodType)} mb-2`}>
            {foodFlag.foodType}
          </Badge>
          
          {isCompact && (
            <Badge variant="outline" className="font-medium">
              {foodFlag.quantity}
            </Badge>
          )}
        </div>
        
        <CardTitle className={`${isCompact ? "text-base" : "text-xl"}`}>
          {foodFlag.title}
        </CardTitle>
        
        <CardDescription className={`line-clamp-2 ${isCompact ? "text-xs" : ""}`}>
          {foodFlag.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className={isCompact ? "p-4 pt-0" : undefined}>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{foodFlag.location} • {foodFlag.distance}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className={`text-muted-foreground ${isUrgent ? "text-destructive font-medium" : ""}`}>
              Expires in {foodFlag.expiryTime} • Posted {foodFlag.postedTime}
            </span>
          </div>
          
          {!isCompact && (
            <div className="flex items-center text-sm mt-2 pt-2 border-t">
              <Award className="h-4 w-4 mr-1 text-ff-orange" />
              <span>Impact: {foodFlag.impact.mealsProvided} meals • {foodFlag.impact.co2Saved}kg CO₂ saved</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className={`flex justify-between gap-2 ${isCompact ? "p-4 pt-0" : ""}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="flex-none">
              <Info className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Donated by {foodFlag.donorName}</p>
          </TooltipContent>
        </Tooltip>
        
        <Button 
          asChild
          className={`btn-gradient flex-1 ${isCompact ? "h-8 text-xs" : ""}`}
        >
          <Link to={`/food/${foodFlag.id}`}>
            {isCompact ? "Claim" : "Claim Food"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
