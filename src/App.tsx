
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Stocks from "./pages/Stocks";
import StockDetails from "./pages/StockDetails";
import Analysis from "./pages/Analysis";
import Academics from "./pages/Academics";
import Groceries from "./pages/Groceries";
import Wallet from "./pages/Wallet";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import PaymentMethods from "./pages/PaymentMethods";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stocks/:symbol" element={<StockDetails />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/groceries" element={<Groceries />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
