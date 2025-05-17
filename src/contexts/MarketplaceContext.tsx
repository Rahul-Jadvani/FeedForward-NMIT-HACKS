import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export type ProductPriority = "high" | "medium" | "low";
export type ProductType = "perishable" | "non-perishable";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  company?: string;
  priority: ProductPriority;
  type: ProductType;
  quantity: number;
  expiry_date?: string;
  seller_id: string;
  seller_name: string;
  created_at: string;
}

export interface ProductFilters {
  search: string;
  priority: ProductPriority | null;
  type: ProductType | null;
  company: string | null;
}

interface MarketplaceContextType {
  products: Product[];
  userProducts: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  loading: boolean;
  setFilters: (filters: Partial<ProductFilters>) => void;
  addProduct: (product: Omit<Product, "id" | "seller_id" | "seller_name" | "created_at">) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "seller_id" | "seller_name" | "created_at">>) => void;
  deleteProduct: (id: string) => void;
  fetchUserProducts: () => void;
}

const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Organic Vegetable Box",
    description: "Freshly harvested seasonal vegetables from local farms. Contains potatoes, carrots, tomatoes, and leafy greens.",
    price: 350,
    image_url: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499",
    company: "Green Earth Farms",
    priority: "high",
    type: "perishable",
    quantity: 10,
    expiry_date: "2025-05-02",
    seller_id: "user1",
    seller_name: "Green Earth Farms",
    created_at: "2025-04-20T08:30:00Z"
  },
  {
    id: "p2",
    name: "Biodegradable Cutlery Set",
    description: "100% biodegradable cutlery made from corn starch. Perfect for events and daily use. Pack of 50 pieces.",
    price: 250,
    image_url: "https://m.media-amazon.com/images/I/91tnv-IRiQL._AC_UF1000,1000_QL80_.jpg",
    company: "EcoWare",
    priority: "medium",
    type: "non-perishable",
    quantity: 25,
    seller_id: "user2",
    seller_name: "EcoWare Solutions",
    created_at: "2025-04-15T12:45:00Z"
  },
  {
    id: "p3",
    name: "Reusable Cotton Produce Bags",
    description: "Set of 5 durable cotton mesh bags for grocery shopping. Machine washable and eco-friendly alternative to plastic.",
    price: 300,
    image_url: "https://images-cdn.ubuy.co.in/64419599ba0fa35b8a65dee7-reusable-organic-cotton-produce-bags.jpg",
    company: "Earth Keeper",
    priority: "low",
    type: "non-perishable",
    quantity: 30,
    seller_id: "user3",
    seller_name: "Earth Keeper Essentials",
    created_at: "2025-04-10T15:20:00Z"
  },
  {
    id: "p4",
    name: "Surplus Bakery Box",
    description: "Assorted bread and pastries rescued from local bakeries. Perfectly good food saved from waste.",
    price: 200,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    company: "Waste Not Bakery",
    priority: "high",
    type: "perishable",
    quantity: 5,
    expiry_date: "2025-04-28",
    seller_id: "user4",
    seller_name: "Waste Not Bakery",
    created_at: "2025-04-22T07:15:00Z"
  },
  {
    id: "p5",
    name: "Solar Phone Charger",
    description: "Compact solar-powered charger for smartphones and small devices. Features 5000mAh battery and dual USB ports.",
    price: 1200,
    image_url: "https://m.media-amazon.com/images/I/41SbDhnLS0L._SR290,290_.jpg",
    company: "SolarTech",
    priority: "medium",
    type: "non-perishable",
    quantity: 8,
    seller_id: "user5",
    seller_name: "SolarTech Innovations",
    created_at: "2025-04-05T09:30:00Z"
  },
  {
    id: "p6",
    name: "Upcycled Tote Bag",
    description: "Unique tote bags handcrafted from reclaimed fabrics. Each piece is one-of-a-kind and supports local artisans.",
    price: 350,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGfUecFAlcDe77Qx5dmr90kiDVM4XTcQxu1Q&s",
    company: "Craft Revival",
    priority: "low",
    type: "non-perishable",
    quantity: 15,
    seller_id: "user6",
    seller_name: "Craft Revival Collective",
    created_at: "2025-04-12T11:45:00Z"
  },
  {
    id: "p7",
    name: "Water-Saving Faucet Attachment",
    description: "Easy-to-install aerator that reduces water usage by up to 70% without sacrificing pressure.",
    price: 180,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9FzdnvmeiflEFYEXhXSFqTy8fBkCEBpAH4g&s",
    company: "H2O Smart",
    priority: "medium",
    type: "non-perishable",
    quantity: 40,
    seller_id: "user7",
    seller_name: "H2O Smart Solutions",
    created_at: "2025-04-08T14:20:00Z"
  },
  {
    id: "p8",
    name: "Rescued Fruit Box",
    description: "Mixed fruits rescued from local markets and farms. Perfectly edible produce saved from waste.",
    price: 280,
    image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
    company: "Second Life Produce",
    priority: "high",
    type: "perishable",
    quantity: 12,
    expiry_date: "2025-04-29",
    seller_id: "user8",
    seller_name: "Second Life Produce",
    created_at: "2025-04-21T10:10:00Z"
  }
];

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFiltersState] = useState<ProductFilters>({
    search: "",
    priority: null,
    type: null,
    company: null
  });

  const userProducts = products.filter(product => product.seller_id === "current_user_id");

  const fetchUserProducts = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const filteredProducts = products.filter((product) => {
    const searchMatch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.company?.toLowerCase().includes(filters.search.toLowerCase());
    
    const priorityMatch = !filters.priority || product.priority === filters.priority;
    
    const typeMatch = !filters.type || product.type === filters.type;
    
    const companyMatch = !filters.company || product.company === filters.company;
    
    return searchMatch && priorityMatch && typeMatch && companyMatch;
  });

  const setFilters = (newFilters: Partial<ProductFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const addProduct = (product: Omit<Product, "id" | "seller_id" | "seller_name" | "created_at">) => {
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      seller_id: "current_user_id",
      seller_name: "Current User",
      created_at: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast.success("Product added successfully!");
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, "id" | "seller_id" | "seller_name" | "created_at">>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
    toast.success("Product updated successfully!");
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    toast.success("Product deleted successfully!");
  };

  useEffect(() => {
    fetchUserProducts();
  }, []);

  return (
    <MarketplaceContext.Provider value={{
      products,
      userProducts,
      filteredProducts,
      filters,
      loading,
      setFilters,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchUserProducts
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};
