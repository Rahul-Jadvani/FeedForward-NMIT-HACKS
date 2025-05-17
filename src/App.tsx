import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Web3Provider } from "./components/providers/Web3Provider";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { Web3Provider as Web3ContextProvider } from "./contexts/Web3Context";

// Import all page components
import Home from "./pages/Home";
import FoodMap from "./pages/FoodMap";
import FoodDetail from "./pages/FoodDetail";
import DonatePage from "./pages/DonatePage";
import NotificationCenter from "./pages/NotificationCenter";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AboutPage from "./pages/AboutPage";
import VolunteerPage from "./pages/VolunteerPage";
import AIInventoryPage from "./pages/AIInventoryPage";
import ExplorePage from "./pages/ExplorePage";
import AIOrderVerificationPage from "./pages/AIOrderVerificationPage";
import AnnapoornaChatbotPage from "./pages/AnnapoornaChatbotPage";
import CSRDashboardPage from "./pages/CSRDashboardPage";
import SanjeevaniPage from "./pages/SanjeevaniPage";
import EcoMarketplacePage from "./pages/EcoMarketplacePage";
import ProfilePage from "./pages/ProfilePage";
import WalletPage from "./pages/WalletPage";
import MarketplacePage from "./pages/MarketplacePage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import FarmerDonations from "./pages/FarmerDonations";
import CommunityImpactPage from "./pages/CommunityImpactPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <ProfileProvider>
                <Web3Provider>
                  <Web3ContextProvider>
                    <MarketplaceProvider>
                      <CartProvider>
                        <Toaster />
                        <Sonner />
                        <Routes>
                          <Route path="/" element={<Layout><Home /></Layout>} />
                          <Route path="/map" element={<Layout><FoodMap /></Layout>} />
                          <Route path="/food/:id" element={<Layout><FoodDetail /></Layout>} />
                          <Route path="/donate" element={<Layout><DonatePage /></Layout>} />
                          <Route path="/notifications" element={<Layout><NotificationCenter /></Layout>} />
                          <Route path="/login" element={<Layout><Login /></Layout>} />
                          <Route path="/signup" element={<Layout><SignUp /></Layout>} />
                          
                          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
                          <Route path="/volunteer" element={<Layout><VolunteerPage /></Layout>} />
                          <Route path="/ai-inventory" element={
                            <Layout>
                              <ProtectedRoute>
                                <AIInventoryPage />
                              </ProtectedRoute>
                            </Layout>
                          } />
                          <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
                          
                          <Route path="/ai-order-verification" element={<Layout><AIOrderVerificationPage /></Layout>} />
                          <Route path="/annapoorna-chatbot" element={<Layout><AnnapoornaChatbotPage /></Layout>} />
                          <Route path="/csr-dashboard" element={<Layout><CSRDashboardPage /></Layout>} />
                          <Route path="/sanjeevani" element={<Layout><SanjeevaniPage /></Layout>} />
                          <Route path="/eco-marketplace" element={<Layout><EcoMarketplacePage /></Layout>} />
                          
                          <Route path="/profile" element={
                            <Layout>
                              <ProtectedRoute>
                                <ProfilePage />
                              </ProtectedRoute>
                            </Layout>
                          } />
                          
                          <Route path="/wallet" element={
                            <Layout>
                              <ProtectedRoute>
                                <WalletPage />
                              </ProtectedRoute>
                            </Layout>
                          } />
                          
                          <Route path="/marketplace" element={
                            <Layout>
                              <MarketplacePage />
                            </Layout>
                          } />
                          
                          <Route path="/seller-dashboard" element={
                            <Layout>
                              <ProtectedRoute>
                                <SellerDashboardPage />
                              </ProtectedRoute>
                            </Layout>
                          } />
                          
                          <Route path="/farmer-donations" element={
                            <Layout>
                              <ProtectedRoute>
                                <FarmerDonations />
                              </ProtectedRoute>
                            </Layout>
                          } />
                          
                          <Route path="/impact" element={
                            <Layout>
                              <CommunityImpactPage />
                            </Layout>
                          } />
                          
                          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
                          
                          <Route path="*" element={<Layout><NotFound /></Layout>} />
                        </Routes>
                      </CartProvider>
                    </MarketplaceProvider>
                  </Web3ContextProvider>
                </Web3Provider>
              </ProfileProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
