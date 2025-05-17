
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  preferences: {
    theme?: string;
    notifications?: boolean;
    marketplaceAlerts?: boolean;
    emailUpdates?: boolean;
  };
  updated_at: string | null;
  created_at: string | null;
};

export type FarmerDonation = {
  id: string;
  user_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  market_price: number | null;
  reason: string | null;
  location: string;
  pickup_date: string | null;
  staked_amount: number;
  contact_details: {
    phone: string;
    email: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
};
