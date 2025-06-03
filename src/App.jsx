
import { Toaster as UIToaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TransitionWrapper from "@/components/ui/transition-wrapper";
import "@/styles/transitions.css";
import Index from "./pages/Index";
import Stocks from "./pages/Stocks";
import StockDetails from "./pages/StockDetails";
import Analysis from "./pages/Analysis";
import Wallet from "./pages/Wallet";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";
import { CopilotProvider } from "./contexts/CopilotContext";
import { ShariahComplianceProvider } from "./contexts/ShariahComplianceContext";
import { LoadingProvider } from "./contexts/LoadingContext";
// Unified Lifestyle feature removed
import { PortfolioProvider } from "./contexts/PortfolioContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import PaymentMethods from "./pages/PaymentMethods";
import Portfolio from "./pages/Portfolio";
// Islamic Finance Advisor feature removed
import FinancialMuftiPage from "./pages/FinancialMufti";
import ZakatCalculatorPage from "./pages/ZakatCalculatorPage";
import IslamicFinance from "./pages/IslamicFinance";
import MurabahaFinance from "./pages/MurabahaFinance";
import IjaraLeasing from "./pages/IjaraLeasing";
import MusharakaPartnership from "./pages/MusharakaPartnership";
import TradeFinance from "./pages/TradeFinance";
import EquipmentFinancing from "./pages/EquipmentFinancing";
// Unified Lifestyle feature removed
import React from "react";
import ChatBot from "./components/ChatBot";



// Create a new QueryClient instance inside the component to ensure proper React context
const App = () => {
  // Initialize the QueryClient inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <PortfolioProvider>
            <CopilotProvider>
              <ShariahComplianceProvider>
                <LoadingProvider>
                  {/* Unified Lifestyle provider removed */}
                    <TooltipProvider>
                    <Toaster />
                    <UIToaster />
                    <BrowserRouter>
                      <AppRoutes />
                    </BrowserRouter>
                  </TooltipProvider>
                  {/* End of Unified Lifestyle provider removed */}
                </LoadingProvider>
              </ShariahComplianceProvider>
            </CopilotProvider>
          </PortfolioProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Separate component for routes to access useLocation hook
const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <TransitionWrapper transitionType="fade" duration={300}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stocks/:symbol" element={<StockDetails />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<Account />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/portfolio" element={<Portfolio />} />
          {/* Islamic Finance Advisor route removed */}
          <Route path="/financial-mufti" element={<FinancialMuftiPage />} />
          <Route path="/zakat-calculator" element={<ZakatCalculatorPage />} />
          <Route path="/islamic-finance" element={<IslamicFinance />} />
          <Route path="/islamic-finance/murabaha" element={<MurabahaFinance />} />
          <Route path="/islamic-finance/ijara" element={<IjaraLeasing />} />
          <Route path="/islamic-finance/musharaka" element={<MusharakaPartnership />} />
          <Route path="/islamic-finance/trade" element={<TradeFinance />} />
          <Route path="/islamic-finance/equipment" element={<EquipmentFinancing />} />
          {/* Unified Lifestyle route removed */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TransitionWrapper>
      
      {/* Global ChatBot that appears on all pages */}
      <ChatBot />
    </>
  );
};

export default App;
