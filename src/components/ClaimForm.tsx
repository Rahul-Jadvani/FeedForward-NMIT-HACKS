import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { FoodFlag } from "./FoodFlagCard";
import { Check, Info, Coins, AlertTriangle } from "lucide-react";
import { ClaimSuccess } from "./ClaimSuccess";
import { StakingForm } from "./StakingForm";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAccount } from "wagmi";

const claimFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  mobileNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  quantityRequested: z.string().min(1, { message: "Please specify quantity" }),
  pickupTime: z.string().min(1, { message: "Please select pickup time" }),
  pickupPersonName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  pickupContactNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  transportMode: z.string().min(1, { message: "Please select transport mode" }),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
  additionalNotes: z.string().optional(),
});

type ClaimFormValues = z.infer<typeof claimFormSchema>;

interface ClaimFormProps {
  foodFlag: FoodFlag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ClaimForm({ foodFlag, open, onOpenChange, onSuccess }: ClaimFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [hasStaked, setHasStaked] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [showStakingForm, setShowStakingForm] = useState(true);
  
  const { isConnected } = useAccount();
  const { feedCoinBalance, donate } = useWeb3();
  
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      quantityRequested: foodFlag.quantity.split(" ")[0], // Extract just the number
      pickupTime: "Within 1 hour",
      pickupPersonName: "",
      pickupContactNumber: "",
      transportMode: "On Foot",
      termsAgreed: undefined, 
      additionalNotes: "",
    },
  });

  const onSubmit = async (values: ClaimFormValues) => {
    if (!hasStaked) {
      toast.error("Staking Required", {
        description: "You must stake FeedCoin to submit this claim.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Form values submitted:", values);
      console.log("For food flag:", foodFlag.id);
      console.log("Staked amount:", stakedAmount);
      
      // If connected to blockchain, call the donate function
      if (isConnected && foodFlag.organizationAddress) {
        // Assuming the foodFlag.organizationAddress is the NGO address
        // and we're donating a small amount for the food claim
        await donate(foodFlag.organizationAddress, "0.001");
      }
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast.success("Food claimed successfully!", {
        description: "You will receive the pickup details shortly.",
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Reset staking state
      setHasStaked(false);
      setStakedAmount(0);
      setShowStakingForm(true);
      
      // Call success callback
      setTimeout(onSuccess, 5000);
      
    } catch (error) {
      toast.error("Failed to submit claim", {
        description: "Please try again or contact support.",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStakingComplete = (amount: number) => {
    setHasStaked(true);
    setStakedAmount(amount);
    setShowStakingForm(false);
    
    toast.success("Staking Successful", {
      description: `You've staked ${amount} FeedCoin for this claim`
    });
  };

  // Check if wallet is connected and has enough balance for staking
  const canStake = isConnected && parseFloat(feedCoinBalance) >= 5;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Food: {foodFlag.title}</DialogTitle>
            <DialogDescription>
              Please provide your details to claim this food. The donor will be notified of your request.
            </DialogDescription>
          </DialogHeader>
          
          {showStakingForm && !hasStaked ? (
            <div className="py-4">
              {!isConnected && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-6 flex items-start gap-3 border border-amber-200 dark:border-amber-700/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      Wallet not connected
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Connect your wallet to use real FeedCoin or continue with mock staking
                    </p>
                  </div>
                </div>
              )}
              
              {isConnected && !canStake && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-6 flex items-start gap-3 border border-amber-200 dark:border-amber-700/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      Insufficient FeedCoin balance
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      You need at least 5 FeedCoin to stake for this claim
                    </p>
                  </div>
                </div>
              )}
              
              <StakingForm formType="claim" onStakingComplete={handleStakingComplete} />
            </div>
          ) : (
            <>
              {hasStaked && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-6 flex items-start gap-3 border border-amber-200 dark:border-amber-700/30">
                  <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      You've staked {stakedAmount} FeedCoin
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Your stake will be returned upon successful food pickup
                    </p>
                  </div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Claim Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantityRequested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity Requested</FormLabel>
                          <FormControl>
                            <Input
                              type="text" 
                              placeholder="How much food you need"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Available: {foodFlag.quantity}
                          </FormDescription>
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
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="Within 1 hour">Within 1 hour</option>
                              <option value="1-3 hours">1-3 hours</option>
                              <option value="Today">Today</option>
                              <option value="Tomorrow">Tomorrow</option>
                            </select>
                          </FormControl>
                          <FormDescription>
                            Expires in {foodFlag.expiryTime}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Pickup Person */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickupPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Person Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Who will collect the food" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pickupContactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Pickup person's contact" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Transport Mode */}
                  <FormField
                    control={form.control}
                    name="transportMode"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Mode of Transport</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="On Foot" id="transport-foot" />
                              <label htmlFor="transport-foot" className="text-sm">On Foot</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Bicycle" id="transport-bicycle" />
                              <label htmlFor="transport-bicycle" className="text-sm">Bicycle</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Motorbike" id="transport-motorbike" />
                              <label htmlFor="transport-motorbike" className="text-sm">Motorbike</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Car" id="transport-car" />
                              <label htmlFor="transport-car" className="text-sm">Car</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Additional Notes */}
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special instructions or requests for the donor"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Terms Agreement */}
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
                            I agree to the terms and conditions
                          </FormLabel>
                          <FormDescription>
                            By claiming this food, you agree to collect it within the specified time frame and accept responsibility for its proper handling.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className={hasStaked ? "btn-gradient" : "bg-muted text-muted-foreground"}
                      disabled={isSubmitting || !hasStaked}
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : !hasStaked ? (
                        "Stake FeedCoin Required"
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Submit Claim
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <ClaimSuccess 
        foodFlag={foodFlag}
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </>
  );
}
