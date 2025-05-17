
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Coins, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface StakingFormProps {
  formType: "donation" | "claim";
  onStakingComplete: (amount: number) => void;
}

export function StakingForm({ formType, onStakingComplete }: StakingFormProps) {
  const [stakingAmount, setStakingAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isStaking, setIsStaking] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const presetAmounts = [1, 5, 10];
  const formTitle = formType === "donation" ? "Stake FeedCoin for Donation" : "Stake FeedCoin to Claim Food";
  const description = formType === "donation" 
    ? "Stake FeedCoin to confirm your donation commitment. Your stake will be refunded upon successful handover."
    : "Stake FeedCoin to confirm your claim. Your stake will be refunded when you pick up the food.";
  
  const handleStakeSubmit = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to stake FeedCoin");
      return;
    }
    
    setIsStaking(true);
    
    // Simulate staking process
    setTimeout(() => {
      toast.success(`Successfully staked ${stakingAmount} FeedCoin`, {
        description: "Your stake will be refunded upon successful completion",
        icon: <Coins className="h-4 w-4" />
      });
      setIsStaking(false);
      onStakingComplete(stakingAmount);
    }, 1500);
  };
  
  const handleCustomAmountChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setCustomAmount(value);
      if (value !== "") {
        setStakingAmount(parseInt(value, 10));
      }
    }
  };
  
  return (
    <Card className="border-2 border-amber-200/50 dark:border-amber-700/30 bg-amber-50/50 dark:bg-amber-900/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-200 dark:bg-amber-700/30 flex items-center justify-center">
            <Coins className="h-4 w-4 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <CardTitle>{formTitle}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Stake Amount:</Label>
            <RadioGroup 
              defaultValue="5" 
              className="flex gap-4"
              onValueChange={(val) => {
                if (val === "custom") {
                  return;
                }
                setStakingAmount(parseInt(val, 10));
                setCustomAmount("");
              }}
            >
              {presetAmounts.map((amount) => (
                <div key={amount} className="flex items-center space-x-2">
                  <RadioGroupItem value={amount.toString()} id={`amount-${amount}`} />
                  <Label htmlFor={`amount-${amount}`} className="flex items-center gap-1">
                    <span>{amount}</span>
                    <Coins className="h-3 w-3" />
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="amount-custom" />
                <Label htmlFor="amount-custom" className="flex items-center gap-1">
                  Custom
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-32"
            />
            <span className="flex items-center">
              <Coins className="h-4 w-4 mr-1" />
              FeedCoin
            </span>
          </div>
          
          <div className="bg-amber-100 dark:bg-amber-800/20 p-3 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              You are required to stake FeedCoin to confirm your intent. This amount will be refunded upon successful completion. If you back out, the stake will be forfeited.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStakeSubmit} 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          disabled={isStaking}
        >
          {isStaking ? (
            <>
              <span className="animate-spin mr-2">●</span>
              Staking...
            </>
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" />
              Stake {stakingAmount} FeedCoin
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
