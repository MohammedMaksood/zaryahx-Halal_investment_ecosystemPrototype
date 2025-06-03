import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Nisab thresholds in grams
const GOLD_NISAB = 87.48; // 87.48 grams of gold
const SILVER_NISAB = 612.36; // 612.36 grams of silver

const ZakatCalculator = () => {
  // AssetValues interface removed and converted to JavaScript object
  const [assets, setAssets] = useState({
    // Gold assets
    goldOwned: 0,
    goldLent: 0,
    goldOwnedWeight: 0,
    goldLentWeight: 0,
    goldPrice: 0,
    
    // Silver assets
    silverOwned: 0,
    silverLent: 0,
    silverOwnedWeight: 0,
    silverLentWeight: 0,
    silverPrice: 0,
    
    // Cash assets
    cashInHand: 0,
    foreignCurrency: 0,
    savingsForGoals: 0,
    savingsInPostOffice: 0,
    moneyLent: 0,
    insuranceSavings: 0,
    outstandingLoanToOthers: 0,
    goldSilverSavings: 0,
    partnershipInvestments: 0,
    sharesAndBonds: 0,
    monetaryInstruments: 0,
    otherSavedAmounts: 0,
    providentFundLoan: 0,
    advanceAmounts: 0,
    
    // Business assets
    rawMaterials: 0,
    preparedGoods: 0,
    stockedGoods: 0,
    receivables: 0,
    profitFromShares: 0,
    assetsForSale: 0,
    rentalIncome: 0,
    
    // Liabilities
    outstandingLoans: 0,
    rentDue: 0,
    salariesDue: 0,
    installmentPayments: 0,
    utilityBills: 0,
    creditCardDebts: 0,
    
    // Other
    unpaidZakat: 0
  });
  
  /** @type {[number|null, function(number|null): void]} */
  const [zakatAmount, setZakatAmount] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  
  // Nisab thresholds in grams
  const GOLD_NISAB = 87.48;
  const SILVER_NISAB = 612.36;
  
  // Separate state for weight and price inputs to avoid circular dependencies
  const [goldSilverInputs, setGoldSilverInputs] = useState({
    goldOwnedWeight: 0,
    goldLentWeight: 0,
    goldPrice: 0,
    silverOwnedWeight: 0,
    silverLentWeight: 0,
    silverPrice: 0
  });

  // Update calculated values when weights or prices change
  useEffect(() => {
    setAssets(prev => ({
      ...prev,
      goldOwned: goldSilverInputs.goldOwnedWeight * goldSilverInputs.goldPrice,
      goldLent: goldSilverInputs.goldLentWeight * goldSilverInputs.goldPrice,
      silverOwned: goldSilverInputs.silverOwnedWeight * goldSilverInputs.silverPrice,
      silverLent: goldSilverInputs.silverLentWeight * goldSilverInputs.silverPrice
    }));
  }, [goldSilverInputs]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    // Handle weight and price inputs separately to avoid circular dependencies
    if (['goldOwnedWeight', 'goldLentWeight', 'goldPrice', 'silverOwnedWeight', 'silverLentWeight', 'silverPrice'].includes(name)) {
      setGoldSilverInputs(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      // Update the assets state with the new value
      setAssets(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };
  
  const calculateZakat = () => {
    setIsCalculating(true);
    setShowResult(false);
    
    // Create a more visible calculation animation
    const calculationSteps = [
      "Collecting assets...",
      "Calculating total value...",
      "Checking Nisab threshold...",
      "Applying Zakat rate...",
      "Finalizing calculation..."
    ];
    
    let step = 0;
    const animationElement = document.getElementById('calculation-animation');
    
    if (animationElement) {
      animationElement.classList.remove('hidden');
      const textElement = animationElement.querySelector('p');
      if (textElement) {
        textElement.textContent = calculationSteps[0];
      }
    }
    
    const animationInterval = setInterval(() => {
      step++;
      if (step < calculationSteps.length && animationElement) {
        const textElement = animationElement.querySelector('p');
        if (textElement) {
          textElement.textContent = calculationSteps[step];
        }
      } else {
        clearInterval(animationInterval);
      }
    }, 400);
    
    // Simulate calculation delay for animation
    setTimeout(() => {
      // Calculate total gold assets
      const totalGoldAssets = assets.goldOwned + assets.goldLent;
      
      // Calculate total silver assets
      const totalSilverAssets = assets.silverOwned + assets.silverLent;
      
      // Calculate total cash assets
      const totalCashAssets = 
        assets.cashInHand + 
        assets.foreignCurrency + 
        assets.savingsForGoals + 
        assets.savingsInPostOffice + 
        assets.moneyLent + 
        assets.insuranceSavings + 
        assets.outstandingLoanToOthers + 
        assets.goldSilverSavings + 
        assets.partnershipInvestments + 
        assets.sharesAndBonds + 
        assets.monetaryInstruments + 
        assets.otherSavedAmounts + 
        assets.providentFundLoan + 
        assets.advanceAmounts;
      
      // Calculate total business assets
      const totalBusinessAssets = 
        assets.rawMaterials + 
        assets.preparedGoods + 
        assets.stockedGoods + 
        assets.receivables + 
        assets.profitFromShares + 
        assets.assetsForSale + 
        assets.rentalIncome;
      
      // Calculate total liabilities
      const totalLiabilities = 
        assets.outstandingLoans + 
        assets.rentDue + 
        assets.salariesDue + 
        assets.installmentPayments + 
        assets.utilityBills + 
        assets.creditCardDebts;
      
      // Calculate total assets
      const totalAssets = totalGoldAssets + totalSilverAssets + totalCashAssets + totalBusinessAssets;
      
      // Calculate net assets (subtract liabilities and unpaid zakat)
      const netAssets = totalAssets - totalLiabilities - assets.unpaidZakat;
      
      // Check if net assets exceed nisab threshold
      // Ensure gold and silver prices are valid to prevent incorrect calculations
      const goldNisabValue = GOLD_NISAB * (goldSilverInputs.goldPrice || 0);
      const silverNisabValue = SILVER_NISAB * (goldSilverInputs.silverPrice || 0);
      
      // If either gold or silver price is not set, use the other one
      let nisabThreshold;
      if (goldSilverInputs.goldPrice && goldSilverInputs.silverPrice) {
        nisabThreshold = Math.min(goldNisabValue, silverNisabValue);
      } else if (goldSilverInputs.goldPrice) {
        nisabThreshold = goldNisabValue;
      } else if (goldSilverInputs.silverPrice) {
        nisabThreshold = silverNisabValue;
      } else {
        // Default to a reasonable value if neither is set
        nisabThreshold = 75000; // Example value in INR
      }
      
      console.log('Net Assets:', netAssets);
      console.log('Nisab Threshold:', nisabThreshold);
      
      // Check eligibility based on nisab threshold
      const isEligibleForZakat = netAssets >= nisabThreshold;
      
      if (isEligibleForZakat) {
        // Calculate zakat at 2.5% of net assets
        const calculatedZakat = netAssets * 0.025;
        setZakatAmount(calculatedZakat);
        setIsEligible(true);
      } else {
        // Not eligible for Zakat
        setZakatAmount(0);
        setIsEligible(false);
      }
      
      setIsCalculating(false);
      setShowResult(true);
      
      if (animationElement) {
        animationElement.classList.add('hidden');
      }
      clearInterval(animationInterval);
    }, 2500);
  };
  
  const resetCalculator = () => {
    // Reset gold/silver inputs state
    setGoldSilverInputs({
      goldOwnedWeight,
      goldLentWeight,
      goldPrice,
      silverOwnedWeight,
      silverLentWeight,
      silverPrice: 0
    });
    
    setAssets({
      // Gold assets
      goldOwned,
      goldLent,
      goldOwnedWeight,
      goldLentWeight,
      goldPrice,
      
      // Silver assets
      silverOwned,
      silverLent,
      silverOwnedWeight,
      silverLentWeight,
      silverPrice,
      
      // Cash assets
      cashInHand,
      foreignCurrency,
      savingsForGoals,
      savingsInPostOffice,
      moneyLent,
      insuranceSavings,
      outstandingLoanToOthers,
      goldSilverSavings,
      partnershipInvestments,
      sharesAndBonds,
      monetaryInstruments,
      otherSavedAmounts,
      providentFundLoan,
      advanceAmounts,
      
      // Business assets
      rawMaterials,
      preparedGoods,
      stockedGoods,
      receivables,
      profitFromShares,
      assetsForSale,
      rentalIncome,
      
      // Liabilities
      outstandingLoans,
      rentDue,
      salariesDue,
      installmentPayments,
      utilityBills,
      creditCardDebts,
      
      // Other
      unpaidZakat: 0
    });
    
    setZakatAmount(null);
    setShowResult(false);
    setIsEligible(false);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border border-lavender/20 overflow-hidden bg-gradient-to-b from-white to-lavender/5">
      <CardHeader className="bg-gradient-to-r from-lavender/20 to-lavender/10 pb-8 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoLTZ2LTZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-lavender/10 rounded-bl-full"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-center text-black mb-2">Zakat Calculator</CardTitle>
          <CardDescription className="text-center text-black/70 max-w-md mx-auto">
            Calculate your Zakat accurately according to Islamic principles. Enter your assets below to determine your obligation.
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 px-8">
        <div className="space-y-8">
          {/* Price Section */}
          <div className="space-y-4 bg-white/50 p-5 rounded-lg border border-lavender/20 shadow-sm transition-all hover:shadow-md hover:border-lavender/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium">Current Prices</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-lavender/20 flex items-center justify-center cursor-help">
                      <HelpCircle className="h-3.5 w-3.5 text-lavender" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-3 shadow-lg border border-lavender/30">
                    <p className="max-w-xs text-sm">Enter the current market prices for gold and silver per gram.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-lavender/10">
                    <th className="py-2 px-4 text-left font-medium text-gray-600"></th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Value (in Indian Rupees)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-lavender/5">
                    <td className="py-3 px-4">Price of 1 gram of Gold</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="goldPrice"
                          name="goldPrice"
                          type="number"
                          placeholder="Enter current gold price per gram"
                          value={goldSilverInputs.goldPrice || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-lavender/30 focus:border-lavender focus:ring-1 focus:ring-lavender/30"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Price of 1 gram of Silver</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="silverPrice"
                          name="silverPrice"
                          type="number"
                          placeholder="Enter current silver price per gram"
                          value={goldSilverInputs.silverPrice || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-lavender/30 focus:border-lavender focus:ring-1 focus:ring-lavender/30"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Gold Section */}
          <div className="space-y-4 bg-white/50 p-5 rounded-lg border border-amber-200/50 shadow-sm transition-all hover:shadow-md hover:border-amber-300/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium">1) Gold</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center cursor-help">
                      <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-3 shadow-lg border border-amber-200">
                    <p className="max-w-xs text-sm">Include all gold assets you own, including jewelry, coins, and bullion.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-amber-100">
                    <th className="py-2 px-4 text-left font-medium text-gray-600"></th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Grams</th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Rupees</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-amber-50">
                    <td className="py-3 px-4">Whatever amount of gold I currently have, its weight in grams, regardless of how it w or for what purpose it is kept</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">g</span>
                        <Input
                          id="goldOwnedWeight"
                          name="goldOwnedWeight"
                          type="number"
                          placeholder="Enter weight in grams"
                          value={goldSilverInputs.goldOwnedWeight || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-amber-200/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-amber-700">₹{assets.goldOwned.toFixed(2)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">The Gold I have lent to others in trust</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">g</span>
                        <Input
                          id="goldLentWeight"
                          name="goldLentWeight"
                          type="number"
                          placeholder="Enter weight in grams"
                          value={goldSilverInputs.goldLentWeight || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-amber-200/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-amber-700">₹{assets.goldLent.toFixed(2)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Silver Section */}
          <div className="space-y-4 bg-white/50 p-5 rounded-lg border border-gray-300/50 shadow-sm transition-all hover:shadow-md hover:border-gray-400/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium">2) Silver</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center cursor-help">
                      <HelpCircle className="h-3.5 w-3.5 text-gray-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-3 shadow-lg border border-gray-300">
                    <p className="max-w-xs text-sm">Include all silver assets you own, including jewelry, coins, and bullion.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-4 text-left font-medium text-gray-600"></th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Grams</th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Rupees</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Whatever amount of silver I currently have, its weight in grams, regardless of how it w or for what purpose it is kept</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">g</span>
                        <Input
                          id="silverOwnedWeight"
                          name="silverOwnedWeight"
                          type="number"
                          placeholder="Enter weight in grams"
                          value={goldSilverInputs.silverOwnedWeight || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-700">₹{assets.silverOwned.toFixed(2)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">The Silver I have lent to others in trust</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">g</span>
                        <Input
                          id="silverLentWeight"
                          name="silverLentWeight"
                          type="number"
                          placeholder="Enter weight in grams"
                          value={goldSilverInputs.silverLentWeight || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-700">₹{assets.silverLent.toFixed(2)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cash Assets Section */}
          <div className="space-y-4 bg-white/50 p-5 rounded-lg border border-green-200/50 shadow-sm transition-all hover:shadow-md hover:border-green-300/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium">3) Cash Assets</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center cursor-help">
                      <HelpCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-3 shadow-lg border border-green-200">
                    <p className="max-w-xs text-sm">Include all cash and cash equivalents you own, including bank deposits, savings, and foreign currency.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-green-100">
                    <th className="py-2 px-4 text-left font-medium text-gray-600"></th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Value (in Indian Rupees)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Cash in hand</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="cashInHand"
                          name="cashInHand"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.cashInHand || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Foreign currency (indicate in terms of domestic currency)</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="foreignCurrency"
                          name="foreignCurrency"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.foreignCurrency || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Savings  (Hajj, Marriage, Building Home) </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="savingsForGoals"
                          name="savingsForGoals"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.savingsForGoals || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Savings in post office</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="savingsInPostOffice"
                          name="savingsInPostOffice"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.savingsInPostOffice || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">The money I have lent to other in trust</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="moneyLent"
                          name="moneyLent"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.moneyLent || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4"> The principal amount accumulated through insurance based savings </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="insuranceSavings"
                          name="insuranceSavings"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.insuranceSavings || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4"> The outstanding amount I have lent to others</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="outstandingLoanToOthers"
                          name="outstandingLoanToOthers"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.outstandingLoanToOthers || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Gold/Silver held in a savings scheme</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="goldSilverSavings"
                          name="goldSilverSavings"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.goldSilverSavings || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">The amount invested in partnership businesses, and the profit earned from it</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="partnershipInvestments"
                          name="partnershipInvestments"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.partnershipInvestments || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Shares and bonds that have the potential to be converted into cash</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="sharesAndBonds"
                          name="sharesAndBonds"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.sharesAndBonds || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Monetary instruments – Demand Drafts & Cheques</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="monetaryInstruments"
                          name="monetaryInstruments"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.monetaryInstruments || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Amount saved in other forms or held by others</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="otherSavedAmounts"
                          name="otherSavedAmounts"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.otherSavedAmounts || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Loan taken from the Provident Fund amount</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="providentFundLoan"
                          name="providentFundLoan"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.providentFundLoan || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-green-50">
                    <td className="py-3 px-4">Any advance amount under your ownership</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="advanceAmounts"
                          name="advanceAmounts"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.advanceAmounts || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-green-200/70 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Business Assets Section */}
          <div className="space-y-4 bg-white/50 p-5 rounded-lg border border-blue-200/50 shadow-sm transition-all hover:shadow-md hover:border-blue-300/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium">4) Business Assets</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center cursor-help">
                      <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-3 shadow-lg border border-blue-200">
                    <p className="max-w-xs text-sm">Include all business assets that are intended for trade, including inventory, raw materials, and receivables.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-blue-100">
                    <th className="py-2 px-4 text-left font-medium text-gray-600"></th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Value (in Indian Rupees)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-50">
                    <td className="py-3 px-4">Raw materials used for manufacturing goods</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="rawMaterials"
                          name="rawMaterials"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.rawMaterials || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-blue-200/70 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-blue-50">
                    <td className="py-3 px-4">Goods that have been prepared and kept ready for sale</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="preparedGoods"
                          name="preparedGoods"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.preparedGoods || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-blue-200/70 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-blue-50">
                    <td className="py-3 px-4">Stocked goods displayed for sale in the shop</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="stockedGoods"
                          name="stockedGoods"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.stockedGoods || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-blue-200/70 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-blue-50">
                    <td className="py-3 px-4">Receivables (amounts due) from goods that have already been sold</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="receivables"
                          name="receivables"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.receivables || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-blue-200/70 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-blue-50">
                    <td className="py-3 px-4">Profit earned by buyers from the sale of company shares</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="profitFromShares"
                          name="profitFromShares"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.profitFromShares || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-blue-200/70 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-blue-50">
                    <td className="py-3 px-4">Assets held with the intention of selling (land, house, shop)</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="assetsForSale"
                          name="assetsForSale"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.assetsForSale || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-blue-200/70 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Rental income amount (from house, shop, land, etc.)</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="rentalIncome"
                          name="rentalIncome"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.rentalIncome || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-blue-200/70 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Liabilities Section */}
          <div className="space-y-4 bg-white/50 p-5 rounded-lg border border-red-200/50 shadow-sm transition-all hover:shadow-md hover:border-red-300/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium">5) Liabilities</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center cursor-help">
                      <HelpCircle className="h-3.5 w-3.5 text-red-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-3 shadow-lg border border-red-200">
                    <p className="max-w-xs text-sm">Include all debts and financial obligations that you owe to others.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-red-100">
                    <th className="py-2 px-4 text-left font-medium text-gray-600"></th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Value (in Indian Rupees)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-red-50">
                    <td className="py-3 px-4">Outstanding loan amounts payable to others</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="outstandingLoans"
                          name="outstandingLoans"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.outstandingLoans || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-red-200/70 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-red-50">
                    <td className="py-3 px-4">Rent amounts that are due to be paid</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="rentDue"
                          name="rentDue"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.rentDue || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-red-200/70 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-red-50">
                    <td className="py-3 px-4">Salaries or payments due to others (e.g., for house, shop, employees)</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="salariesDue"
                          name="salariesDue"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.salariesDue || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-red-200/70 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-red-50">
                    <td className="py-3 px-4">Balance amounts payable for goods purchased on installment</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="installmentPayments"
                          name="installmentPayments"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.installmentPayments || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-red-200/70 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-red-50">
                    <td className="py-3 px-4">Utility bills and service payments I need to pay (e.g., telephone, mobile, milk, drinking water, gas, taxes, electricity bills, etc.)</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="utilityBills"
                          name="utilityBills"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.utilityBills || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-red-200/70 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Credit card debts or loans obtained through credit cards</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="creditCardDebts"
                          name="creditCardDebts"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.creditCardDebts || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-red-200/70 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Unpaid Zakat Section */}
          <div className="space-y-4 bg-white/50 p-5 rounded-lg border border-purple-200/50 shadow-sm transition-all hover:shadow-md hover:border-purple-300/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium">6) Unpaid Zakat</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center cursor-help">
                      <HelpCircle className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-3 shadow-lg border border-purple-200">
                    <p className="max-w-xs text-sm">Enter any Zakat amount that w in previous years but h been paid yet.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-purple-100">
                    <th className="py-2 px-4 text-left font-medium text-gray-600"></th>
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Value (in Indian Rupees)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4">Unpaid Zakat from previous years</td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">₹</span>
                        <Input
                          id="unpaidZakat"
                          name="unpaidZakat"
                          type="number"
                          placeholder="Enter amount"
                          value={assets.unpaidZakat || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 bg-white border-purple-200/70 focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Section */}
          {showResult && (
            <div className="mt-8 bg-white/80 p-6 rounded-lg border border-lavender/30 shadow-md">
              <h3 className="text-xl font-semibold text-center mb-4">Zakat Calculation Results</h3>
              
              {isEligible ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-green-700">You are eligible to pay Zakat</span>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-center text-green-800 mb-2">Your Zakat Amount:</p>
                    <p className="text-center text-3xl font-bold text-green-700">₹{zakatAmount?.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-lavender/5 p-4 rounded-lg border border-lavender/20">
                    <h4 className="font-medium mb-2 text-center">Summary</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">Total Gold Assets:</div>
                      <div>₹{(assets.goldOwned + assets.goldLent).toFixed(2)}</div>
                      
                      <div className="text-right font-medium">Total Silver Assets:</div>
                      <div>₹{(assets.silverOwned + assets.silverLent).toFixed(2)}</div>
                      
                      <div className="text-right font-medium">Total Cash Assets:</div>
                      <div>₹{(
                        assets.cashInHand + 
                        assets.foreignCurrency + 
                        assets.savingsForGoals + 
                        assets.savingsInPostOffice + 
                        assets.moneyLent + 
                        assets.insuranceSavings + 
                        assets.outstandingLoanToOthers + 
                        assets.goldSilverSavings + 
                        assets.partnershipInvestments + 
                        assets.sharesAndBonds + 
                        assets.monetaryInstruments + 
                        assets.otherSavedAmounts + 
                        assets.providentFundLoan + 
                        assets.advanceAmounts
                      ).toFixed(2)}</div>
                      
                      <div className="text-right font-medium">Total Business Assets:</div>
                      <div>₹{(
                        assets.rawMaterials + 
                        assets.preparedGoods + 
                        assets.stockedGoods + 
                        assets.receivables + 
                        assets.profitFromShares + 
                        assets.assetsForSale + 
                        assets.rentalIncome
                      ).toFixed(2)}</div>
                      
                      <div className="text-right font-medium">Total Liabilities:</div>
                      <div>₹{(
                        assets.outstandingLoans + 
                        assets.rentDue + 
                        assets.salariesDue + 
                        assets.installmentPayments + 
                        assets.utilityBills + 
                        assets.creditCardDebts
                      ).toFixed(2)}</div>
                      
                      <div className="text-right font-medium">Unpaid Zakat:</div>
                      <div>₹{assets.unpaidZakat.toFixed(2)}</div>
                      
                      <div className="border-t border-lavender/20 col-span-2 my-2"></div>
                      
                      <div className="text-right font-medium">Nisab Threshold:</div>
                      <div>₹{Math.min(
                        GOLD_NISAB * goldSilverInputs.goldPrice,
                        SILVER_NISAB * goldSilverInputs.silverPrice
                      ).toFixed(2)}</div>
                      
                      <div className="text-right font-medium">Zakat Rate:</div>
                      <div>2.5%</div>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      This calculation is based on the information you provided. Please consult with a qualified Islamic scholar for specific guidance on your Zakat obligations.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6 flex justify-center">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-8 py-5"
                      onClick={() => window.open('https://donate.zaryahplus.org', '_blank')}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Donate Now
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-amber-700">You are not eligible to pay Zakat</span>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-center text-amber-800">Your assets do not meet the Nisab threshold required for Zakat.</p>
                  </div>
                  
                  <div className="bg-lavender/5 p-4 rounded-lg border border-lavender/20">
                    <h4 className="font-medium mb-2 text-center">Summary</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">Your Net Assets:</div>
                      <div>₹{(
                        (assets.goldOwned + assets.goldLent) +
                        (assets.silverOwned + assets.silverLent) +
                        (assets.cashInHand + 
                        assets.foreignCurrency + 
                        assets.savingsForGoals + 
                        assets.savingsInPostOffice + 
                        assets.moneyLent + 
                        assets.insuranceSavings + 
                        assets.outstandingLoanToOthers + 
                        assets.goldSilverSavings + 
                        assets.partnershipInvestments + 
                        assets.sharesAndBonds + 
                        assets.monetaryInstruments + 
                        assets.otherSavedAmounts + 
                        assets.providentFundLoan + 
                        assets.advanceAmounts) +
                        (assets.rawMaterials + 
                        assets.preparedGoods + 
                        assets.stockedGoods + 
                        assets.receivables + 
                        assets.profitFromShares + 
                        assets.assetsForSale + 
                        assets.rentalIncome) -
                        (assets.outstandingLoans + 
                        assets.rentDue + 
                        assets.salariesDue + 
                        assets.installmentPayments + 
                        assets.utilityBills + 
                        assets.creditCardDebts)
                      ).toFixed(2)}</div>
                      
                      <div className="text-right font-medium">Nisab Threshold:</div>
                      <div>₹{Math.min(
                        GOLD_NISAB * goldSilverInputs.goldPrice,
                        SILVER_NISAB * goldSilverInputs.silverPrice
                      ).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      While you may not be eligible for Zakat based on the Nisab threshold, consider voluntary charity (Sadaqah)  means of purifying your wealth and helping those in need.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}
          
          {/* Calculation Animation */}
          <div id="calculation-animation" className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border border-lavender/30 text-center w-80">
            <div className="flex items-center justify-center mb-4">
              <div className="h-8 w-8 border-4 border-lavender border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-lavender animate-pulse">Calculating...</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between pt-8 pb-8 px-8 bg-gradient-to-b from-transparent to-lavender/5 border-t border-lavender/10">
        <Button 
          variant="outline" 
          onClick={resetCalculator}
          className="w-full sm:w-auto border-lavender/30 hover:bg-lavender/5 hover:text-lavender transition-all duration-300 rounded-full px-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Calculator
        </Button>
        
        <Button 
          onClick={calculateZakat}
          className="w-full sm:w-auto bg-gradient-to-r from-lavender to-lavender-dark hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-8 py-6"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <div className="flex items-center">
              <span className="mr-2 h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
              <span className="animate-pulse">Calculating...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Zakat
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZakatCalculator;