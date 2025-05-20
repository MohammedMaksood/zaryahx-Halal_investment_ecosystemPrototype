
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import PaymentMethods from "./pages/PaymentMethods";
import Portfolio from "./pages/Portfolio";
import IslamicFinanceAdvisor from "./pages/AIFeatures";
import FinancialMuftiPage from "./pages/FinancialMufti";
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
          <CopilotProvider>
            <ShariahComplianceProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
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
                  <Route path="/islamic-finance-advisor" element={<IslamicFinanceAdvisor />} />
                  <Route path="/financial-mufti" element={<FinancialMuftiPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {/* Global ChatBot that appears on all pages */}
                <ChatBot />
              </BrowserRouter>
              </TooltipProvider>
            </ShariahComplianceProvider>
          </CopilotProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
