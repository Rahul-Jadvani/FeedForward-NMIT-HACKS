
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FoodFlagGrid } from "@/components/FoodFlagGrid";
import { mockFoodFlags } from "@/data/mockData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MapPin, Search, Filter, List, Grid3X3, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import InteractiveMap from "@/components/InteractiveMap";

// Define the filter form schema
const filterFormSchema = z.object({
  foodTypes: z.array(z.string()).default([]),
  includeExpiringSoon: z.boolean().default(false),
  includeNewlyAdded: z.boolean().default(false),
  sortBy: z.string().default("distance"),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

export default function FoodMap() {
  const navigate = useNavigate();
  const [view, setView] = useState<"map" | "list">("map");
  const [distance, setDistance] = useState([5]);
  const [searchQuery, setSearchQuery] = useState("");
  const [foodType, setFoodType] = useState<string>("all");
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Create form for advanced filters
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      foodTypes: [],
      includeExpiringSoon: false,
      includeNewlyAdded: false,
      sortBy: "distance",
    },
  });
  
  // Apply basic filters (search, food type, distance)
  const filteredFlags = mockFoodFlags.filter((flag) => {
    // Search filter
    if (searchQuery && !flag.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Food type filter
    if (foodType !== "all" && flag.foodType.toLowerCase() !== foodType.toLowerCase()) {
      return false;
    }
    
    // Distance filter (mock implementation)
    const flagDistance = parseFloat(flag.distance.split(" ")[0]);
    if (flagDistance > distance[0]) {
      return false;
    }
    
    return true;
  });
  
  // Apply advanced filters if filtering is active
  const sortedFlags = [...filteredFlags].sort((a, b) => {
    const sortBy = form.watch("sortBy");
    
    if (sortBy === "distance") {
      return parseFloat(a.distance.split(" ")[0]) - parseFloat(b.distance.split(" ")[0]);
    }
    
    if (sortBy === "expiry") {
      // Simple string comparison for this demo
      return a.expiryTime.localeCompare(b.expiryTime);
    }
    
    if (sortBy === "newest") {
      return a.postedTime.localeCompare(b.postedTime);
    }
    
    return 0;
  });
  
  // Handle form submission
  function onSubmit(data: FilterFormValues) {
    setIsFiltering(true);
    
    // Apply filters (in a real app, this would modify the filteredFlags state)
    console.log("Filter applied:", data);
    
    toast.success("Filters applied", {
      description: `Found ${filteredFlags.length} food flags nearby`,
    });
  }
  
  // Simulate flag refresh
  const refreshFoodFlags = () => {
    toast.info("Refreshing food flags...", {
      description: "Looking for new food donations nearby",
    });
    
    // In a real app, this would trigger an API call
    setTimeout(() => {
      toast.success("Food flags updated!", {
        description: "Found 3 new food donations",
      });
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Food Map</h1>
          <p className="text-muted-foreground">Browse and claim available food donations near you</p>
        </div>
        
        <div className="flex gap-2">
          <Tabs 
            value={view} 
            onValueChange={(v) => setView(v as "map" | "list")}
            className="w-[200px]"
          >
            <TabsList className="w-full">
              <TabsTrigger value="map" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                Map
              </TabsTrigger>
              <TabsTrigger value="list" className="flex-1">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="icon" onClick={refreshFoodFlags}>
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for food..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <Select value={foodType} onValueChange={setFoodType}>
            <SelectTrigger>
              <SelectValue placeholder="Food Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Distance: {distance[0]} km</label>
          <Slider
            value={distance}
            onValueChange={setDistance}
            max={20}
            step={1}
            className="mt-2"
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Customize your search to find exactly what you're looking for.
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="foodTypes"
                    render={() => (
                      <FormItem>
                        <FormLabel>Food Categories</FormLabel>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {["Cooked Meals", "Produce", "Bakery", "Dairy", "Packaged"].map((type) => (
                            <FormField
                              key={type}
                              control={form.control}
                              name="foodTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== type
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {type}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeExpiringSoon"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Expiring Soon ({"<"} 3 hours)</FormLabel>
                          <FormDescription>
                            These items need to be claimed quickly
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeNewlyAdded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Newly Added ({"<"} 1 hour)</FormLabel>
                          <FormDescription>
                            Fresh donations just posted
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sortBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Results By</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sort order" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="distance">Distance (Closest First)</SelectItem>
                            <SelectItem value="expiry">Expiry Time (Soonest First)</SelectItem>
                            <SelectItem value="newest">Recently Added</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setIsFiltering(false);
                      }}
                    >
                      Reset
                    </Button>
                    <Button type="submit" className="btn-gradient">
                      Apply Filters
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Tabs components */}
      <Tabs value={view} onValueChange={(v) => setView(v as "map" | "list")}>
        <TabsContent value="map" className="mt-0 animate-fade-in">
          <div className="relative rounded-lg overflow-hidden border h-[500px] mb-6">
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-muted backdrop-blur-sm hover:bg-blue-600 shadow-md"
                onClick={refreshFoodFlags}
              >
                <MapPin className="h-4 w-4 mr-2 text-ff-blue" /> Find Nearby
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-muted backdrop-blur-sm hover:bg-blue-600 shadow-md"
                onClick={() => navigate('/donate')}
              >
                <Calendar className="h-4 w-4 mr-2 text-ff-green" /> Add Food Flag
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 z-10 bg-muted backdrop-blur-sm hover:bg-blue-600 backdrop-blur-sm p-2 rounded-md shadow-md">
              <p className="text-xs font-medium">Food Flags: {sortedFlags.length}</p>
              <p className="text-xs text-muted-foreground">Click on a flag for details</p>
            </div>
            <InteractiveMap 
              foodFlags={sortedFlags}
              onFoodFlagClick={(id) => navigate(`/food/${id}`)}
            />
          </div>
          
          <h3 className="text-xl font-medium mb-4">Available Near You</h3>
          <FoodFlagGrid 
            foodFlags={sortedFlags.slice(0, 3)} 
            onFoodFlagClick={(id) => navigate(`/food/${id}`)}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">All Available Food ({sortedFlags.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <FoodFlagGrid 
            foodFlags={sortedFlags}
            variant="compact"
            onFoodFlagClick={(id) => navigate(`/food/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
