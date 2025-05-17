import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Coins } from "lucide-react";
import { StakingForm } from "@/components/StakingForm";
import type { FarmerDonation } from "@/types/donations";

export default function FarmerDonations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<FarmerDonation[]>([]);
  const [hasStaked, setHasStaked] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(0);

  const [formData, setFormData] = useState({
    crop_name: "",
    quantity: "",
    unit: "kg",
    market_price: "",
    reason: "",
    location: "",
    pickup_date: "",
    contact_details: {
      phone: "",
      email: user?.email || "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasStaked) {
      toast({
        title: "Staking Required",
        description: "You must stake FeedCoin to submit this donation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("farmer_donations")
        .insert([
          {
            ...formData,
            quantity: Number(formData.quantity),
            market_price: formData.market_price ? Number(formData.market_price) : null,
            user_id: user?.id,
            staked_amount: stakedAmount,
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your donation has been registered successfully.",
      });

      // Reset form
      setFormData({
        crop_name: "",
        quantity: "",
        unit: "kg",
        market_price: "",
        reason: "",
        location: "",
        pickup_date: "",
        contact_details: {
          phone: "",
          email: user?.email || "",
        },
      });
      
      setHasStaked(false);
      setStakedAmount(0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStakingComplete = (amount: number) => {
    setHasStaked(true);
    setStakedAmount(amount);
    
    toast({
      title: "Staking Successful",
      description: `You've staked ${amount} FeedCoin for this donation`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Donate Excess Crops</h1>
        
        {!hasStaked && (
          <div className="mb-8">
            <StakingForm formType="donation" onStakingComplete={handleStakingComplete} />
          </div>
        )}
        
        {hasStaked && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-8 flex items-start gap-3 border border-amber-200 dark:border-amber-700/30">
            <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-300">
                You've staked {stakedAmount} FeedCoin
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Your stake will be returned upon successful donation handover
              </p>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crop Name</label>
                  <Input
                    required
                    value={formData.crop_name}
                    onChange={(e) =>
                      setFormData({ ...formData, crop_name: e.target.value })
                    }
                    placeholder="Enter crop name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity (in kg)</label>
                  <Input
                    required
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Market Price (optional)</label>
                  <Input
                    type="number"
                    value={formData.market_price}
                    onChange={(e) =>
                      setFormData({ ...formData, market_price: e.target.value })
                    }
                    placeholder="Enter market price"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Enter pickup location"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={formData.contact_details.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_details: {
                          ...formData.contact_details,
                          phone: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter contact number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Date</label>
                  <Input
                    type="date"
                    value={formData.pickup_date}
                    onChange={(e) =>
                      setFormData({ ...formData, pickup_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Donation</label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Share why you're donating these crops..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className={hasStaked ? "w-full btn-gradient" : "w-full bg-muted text-muted-foreground"}
                disabled={loading || !hasStaked}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!hasStaked ? (
                  <>Stake FeedCoin Required</>
                ) : (
                  <>Submit Donation</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
