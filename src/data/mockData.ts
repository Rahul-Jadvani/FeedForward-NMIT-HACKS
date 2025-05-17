
import { FoodFlag } from "../components/FoodFlagCard";

export const mockFoodFlags: FoodFlag[] = [
  {
    id: "ff-001",
    title: "Leftover Corporate Lunch Buffet",
    description: "Fresh sandwiches, salads, and pastries from today's board meeting. All individually wrapped and safe to consume.",
    foodType: "Vegetarian",
    quantity: "Serves 10-15",
    location: "Downtown Business Center",
    distance: "1.2 km away",
    expiryTime: "3 hours",
    postedTime: "20 min ago",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    donorName: "TechGlobal Inc.",
    donorRating: 4.8,
    organizationAddress: "0x123abc456def789ghi012jkl345mno678pqr901",
    impact: {
      mealsProvided: 15,
      co2Saved: 12.5
    }
  },
  {
    id: "ff-002",
    title: "Wedding Reception Surplus",
    description: "Variety of appetizers, main courses, and desserts from a wedding reception. Food is packaged and ready for pickup.",
    foodType: "Mixed",
    quantity: "Serves 20+",
    location: "Grand Plaza Hotel",
    distance: "3.5 km away",
    expiryTime: "5 hours",
    postedTime: "1 hour ago",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    donorName: "Event Horizon Catering",
    donorRating: 4.9,
    organizationAddress: "0x234bcd567efg890hij123klm456nop789qrs012",
    impact: {
      mealsProvided: 25,
      co2Saved: 20.3
    }
  },
  {
    id: "ff-003",
    title: "Fresh Produce from Local Farm",
    description: "Seasonal vegetables and fruits that didn't make it to the farmer's market. All organic and freshly harvested.",
    foodType: "Vegan",
    quantity: "15kg assorted produce",
    location: "Sunnydale Farms",
    distance: "8.7 km away",
    expiryTime: "2 days",
    postedTime: "3 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    donorName: "Sunnydale Organic Farms",
    donorRating: 4.7,
    organizationAddress: "0x345cde678fgh901ijk234lmn567opq890rst123",
    impact: {
      mealsProvided: 30,
      co2Saved: 18.6
    }
  },
  {
    id: "ff-004",
    title: "Bakery End-of-Day Items",
    description: "Assorted bread, pastries, and cakes from our daily bake. All baked fresh today and perfect for immediate consumption or freezing.",
    foodType: "Vegetarian",
    quantity: "Approx. 30 items",
    location: "Golden Crust Bakery",
    distance: "0.8 km away",
    expiryTime: "1 day",
    postedTime: "30 min ago",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    donorName: "Golden Crust Bakery",
    donorRating: 4.9,
    organizationAddress: "0x456def789ghi012jkl345mno678pqr901stu234",
    impact: {
      mealsProvided: 20,
      co2Saved: 8.3
    }
  },
  {
    id: "ff-005",
    title: "Restaurant Surplus Meals",
    description: "Prepared meals including pasta, curry, and rice dishes that were made fresh today but not sold. Proper handling guaranteed.",
    foodType: "Non-Vegetarian",
    quantity: "Serves 8-10",
    location: "Taste of Home Restaurant",
    distance: "2.3 km away",
    expiryTime: "6 hours",
    postedTime: "45 min ago",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    donorName: "Taste of Home",
    donorRating: 4.6,
    organizationAddress: "0x567efg890hij123klm456nop789qrs012tuv345",
    impact: {
      mealsProvided: 10,
      co2Saved: 15.2
    }
  },
  {
    id: "ff-006",
    title: "Supermarket Daily Clearance",
    description: "Various food items approaching best-before dates. Includes dairy, packaged meals, and fresh produce. All perfectly safe to consume.",
    foodType: "Mixed",
    quantity: "Large assortment",
    location: "FreshMart Supermarket",
    distance: "3.1 km away",
    expiryTime: "12 hours",
    postedTime: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    donorName: "FreshMart",
    donorRating: 4.5,
    organizationAddress: "0x678fgh901ijk234lmn567opq890rst123uvw456",
    impact: {
      mealsProvided: 40,
      co2Saved: 35.8
    }
  }
];

export const impactStats = {
  mealsDonated: 158420,
  foodSaved: 79210,
  co2Prevented: 316840,
  activeDonors: 2430,
  activeRecipients: 845,
  totalFlags: 12450
};
