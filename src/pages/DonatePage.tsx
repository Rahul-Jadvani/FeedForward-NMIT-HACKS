import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Camera, 
  Calendar, 
  Upload, 
  CheckCircle, 
  Info,
  Utensils,
  Leaf,
  AlertCircle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import LocationPicker from "@/components/LocationPicker";

// Create a schema for food donation
const donationFormSchema = z.object({
  // Donor Information
  donorType: z.string().min(1, "Please select donor type"),
  organizationName: z.string().optional(),
  contactPersonName: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),

  // Food Details
  foodType: z.array(z.string()).min(1, "Select at least one food type"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.string().min(1, "Please specify quantity"),
  unit: z.string().min(1, "Please select unit"),
  servings: z.string().optional(),
  dietary: z.array(z.string()).optional(),
  preparedDateTime: z.string().optional(),
  bestBefore: z.string().min(1, "Please specify best before date/time"),

  // Location & Pickup
  pickupAddress: z.string().min(5, "Please enter a valid address"),
  pickupTimeWindow: z.string().min(1, "Please specify pickup time"),
  logisticsSupport: z.boolean().optional(),
  onSiteContact: z.string().optional(),

  // Packaging
  isHygienicallyPacked: z.enum(["yes", "no", "partially"]),
  packagingType: z.array(z.string()).optional(),
  servingInstructions: z.string().optional(),

  // Legal
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
  liabilityWaiver: z.literal(true, {
    errorMap: () => ({ message: "You must accept the liability waiver" }),
  }),

  // Rewards
  claimRewards: z.boolean().optional(),
  preferredNgo: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

export default function DonatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  // Initialize the form with default values
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donorType: "",
      organizationName: "",
      contactPersonName: "",
      contactNumber: "",
      email: "",
      foodType: [],
      title: "",
      description: "",
      quantity: "",
      unit: "",
      servings: "",
      dietary: [],
      preparedDateTime: "",
      bestBefore: "",
      pickupAddress: "",
      pickupTimeWindow: "",
      logisticsSupport: false,
      onSiteContact: "",
      isHygienicallyPacked: "yes",
      packagingType: [],
      servingInstructions: "",
      termsAgreed: undefined,
      liabilityWaiver: undefined,
      claimRewards: false,
      preferredNgo: "",
    },
  });
  
  const onSubmit = (values: DonationFormValues) => {
    console.log("Form values:", values);
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Food Flag Created!",
        description: "Your donation has been successfully posted.",
      });
      navigate("/");
    }, 1500);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 5); // Limit to 5 images
      });
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Donate Surplus Food</h1>
          <p className="text-muted-foreground">
            Create a FoodFlag to share your surplus food with those in need
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in" style={{animationDelay: "0.1s"}}>
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-full bg-ff-green/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-ff-green" />
              </div>
              <CardTitle className="text-lg">Reduce Waste</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Help reduce food waste by connecting with those who can use it.
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{animationDelay: "0.2s"}}>
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-full bg-ff-orange/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-ff-orange" />
              </div>
              <CardTitle className="text-lg">Feed Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support your local community by providing food to those in need.
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{animationDelay: "0.3s"}}>
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-full bg-ff-yellow/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-ff-yellow" />
              </div>
              <CardTitle className="text-lg">Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Receive FeedCoins for your donations that can be redeemed for perks.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="animate-fade-in" style={{animationDelay: "0.4s"}}>
          <CardHeader>
            <CardTitle>Create a FoodFlag</CardTitle>
            <CardDescription>
              Fill out the details about the food you're donating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Donor Information Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Utensils className="h-5 w-5" /> Donor Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="donorType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donor Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select donor type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="individual">Individual</SelectItem>
                              <SelectItem value="restaurant">Restaurant</SelectItem>
                              <SelectItem value="caterer">Caterer</SelectItem>
                              <SelectItem value="corporation">Corporation</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the type of donor you represent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name (if applicable)</FormLabel>
                          <FormControl>
                            <Input placeholder="Organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Food Details Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Leaf className="h-5 w-5" /> Food Details
                  </h2>
                  
                  <FormField
                    control={form.control}
                    name="foodType"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Food Type</FormLabel>
                          <FormDescription>
                            Select all applicable types
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {["Cooked", "Raw", "Packaged", "Perishable", "Non-Perishable"].map(
                            (item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="foodType"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.toLowerCase())}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.toLowerCase()])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.toLowerCase()
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food Title</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Corporate Lunch Leftovers" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., 10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                <SelectItem value="servings">Servings</SelectItem>
                                <SelectItem value="litres">Litres</SelectItem>
                                <SelectItem value="packets">Packets</SelectItem>
                                <SelectItem value="items">Items</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the food, packaging, and any special instructions..."
                            className="resize-none h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dietary"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Dietary Restrictions & Tags</FormLabel>
                          <FormDescription>
                            Select all applicable tags
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {["Vegetarian", "Vegan", "Halal", "Gluten-Free", "Dairy-Free", "Nut-Free", "Spicy", "Contains Allergens"].map(
                            (item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="dietary"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.toLowerCase())}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], item.toLowerCase()])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.toLowerCase()
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preparedDateTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Prepared Date & Time (if applicable)
                          </FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormDescription>
                            When was the food prepared?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bestBefore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Best Before Date & Time
                          </FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormDescription>
                            How long will the food remain fresh?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Location & Pickup Section */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold">Location & Pickup Details</h2>
                    <p className="text-muted-foreground">
                      Please provide the pickup location and timing details
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pickupAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Address</FormLabel>
                          <FormControl>
                            <LocationPicker
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pickupDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pickupTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Packaging & Images Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Packaging & Images</h2>
                  
                  <FormField
                    control={form.control}
                    name="isHygienicallyPacked"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Is the food hygienically packed?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Yes, all items are properly packed
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="partially" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Partially, some items need packaging
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No, packaging assistance needed
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="packagingType"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Packaging Type (select all that apply)</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {["Plastic boxes", "Foil trays", "Tiffin boxes", "Bulk containers", "Disposable containers", "Other"].map(
                            (item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="packagingType"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.toLowerCase())}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], item.toLowerCase()])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.toLowerCase()
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="servingInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serving Instructions / Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special instructions for handling or serving the food..."
                            className="resize-none h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Label className="flex items-center gap-1 mb-2">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      Upload Photos (Optional)
                    </Label>
                    <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                      {images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                              <img 
                                src={URL.createObjectURL(img)} 
                                alt={`Food image ${idx+1}`} 
                                className="object-cover w-full h-full"
                              />
                              <button 
                                type="button"
                                onClick={() => removeImage(idx)} 
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500"
                              >
                                <AlertCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Drag and drop image files here, or click to browse
                          </p>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        type="button"
                        onClick={() => document.getElementById("image-upload")?.click()}
                        disabled={images.length >= 5}
                      >
                        {images.length > 0 ? `Add more images (${5 - images.length} left)` : "Browse Files"}
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={images.length >= 5}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Legal & Terms Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Legal & Terms</h2>
                  
                  <FormField
                    control={form.control}
                    name="termsAgreed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the donation terms and conditions
                          </FormLabel>
                          <FormDescription>
                            You confirm that the food is safe, not spoiled, and free to distribute
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="liabilityWaiver"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the food donation liability waiver
                          </FormLabel>
                          <FormDescription>
                            You waive liability for the food after transfer to recipients or food distribution partners
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-muted p-4 rounded-md flex items-start gap-3">
                    <Info className="h-5 w-5 text-ff-orange flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Food Safety Guidelines:</p>
                      <p className="text-muted-foreground">
                        Make sure the food is properly packaged, safe to consume, and within its expiry date. 
                        Provide accurate information to help recipients assess suitability.
                      </p>
                    </div>
                  </div>

                  {/* Rewards Section */}
                  <FormField
                    control={form.control}
                    name="claimRewards"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-amber-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Claim FeedCoin Rewards
                          </FormLabel>
                          <FormDescription>
                            Receive tokens for verified food donations that can be redeemed for perks
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("claimRewards") && (
                    <FormField
                      control={form.control}
                      name="preferredNgo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred NGO Partner (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred NGO" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="feeding_india">Feeding India</SelectItem>
                              <SelectItem value="food_bank">City Food Bank</SelectItem>
                              <SelectItem value="robin_hood">Robin Hood Army</SelectItem>
                              <SelectItem value="no_waste">No Food Waste</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose a specific NGO to handle your donation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="btn-gradient w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating FoodFlag..." : "Create FoodFlag"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="ghost" type="button">
              Save as Draft
            </Button>
            <Button variant="outline" type="button">
              Preview
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
