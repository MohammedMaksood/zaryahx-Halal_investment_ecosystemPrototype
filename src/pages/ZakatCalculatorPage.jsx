import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ZakatCalculator from "@/components/ZakatCalculator";

const ZakatCalculatorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-4 text-black">Zakat Calculator</h1>
              <p className="text-black">
                Calculate your Zakat according to Islamic principles. Include all your assets, 
                deduct eligible liabilities, and determine your Zakat obligation.
              </p>
            </div>
            
            <ZakatCalculator />
            
            <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">About Zakat Calculation</h2>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Assets to be included:</strong> Cash, Gold, Silver, and Business items.
                  All these categories must be included in your calculation.
                </p>
                <p>
                  <strong>Zakat Threshold (Nisab):</strong> 87.48 grams of gold or 612.36 grams of silver, 
                  whichever is less valuable.
                </p>
                <p>
                  <strong>Calculation Method:</strong> The total value of all assets minus debts and liabilities. 
                  2.5% (one-fortieth) of the remaining total should be calculated .
                </p>
                <p>
                  <strong>Debts and Liabilities:</strong> Only short-term or current liabilities are allowed to be deducted.
                </p>
                <p>
                  <strong>Important Note:</strong> This calculator is provided  guide. For specific rulings related to your 
                  personal situation, please consult with a qualified Islamic scholar.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-lavender/10 rounded-lg border border-lavender/20">
              <h2 className="text-xl font-semibold mb-4">Zakat According to the Four Sunni Madhahib (Schools of Thought)</h2>
              <p className="mb-4 text-sm">All four schools agree on the fundamental obligation of Zakat but differ on some details.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-white/50 rounded-lg border border-lavender/30 shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-lavender-dark">1. Hanafi School</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Most inclusive in terms of zakatable assets.</li>
                    <li>Gold and silver are zakatable in any form.</li>
                    <li>Debts owed to you are zakatable if recoverable.</li>
                    <li>Nisab can be calculated using either gold or silver.</li>
                    <li>No exemption for personal jewelry unless minimal.</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white/50 rounded-lg border border-lavender/30 shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-lavender-dark">2. Shafi'i School</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Requires clear ownership for one lunar year (hawl).</li>
                    <li>Personal-use gold/silver jewelry is exempt.</li>
                    <li>Debts are zakatable only when repaid.</li>
                    <li>Only trade goods are zakatable.</li>
                    <li>Emphasizes intention and defined calculation periods.</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white/50 rounded-lg border border-lavender/30 shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-lavender-dark">3. Maliki School</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Exempts personal-use gold/silver jewelry.</li>
                    <li>Includes business assets and partnership profits.</li>
                    <li>Agricultural produce and livestock are detailed.</li>
                    <li>Debts deducted only if significant.</li>
                    <li>Allows estimation for assets like stocks.</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white/50 rounded-lg border border-lavender/30 shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-lavender-dark">4. Hanbali School</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Similar to Shafi'i on wealth possession for one year.</li>
                    <li>Jewelry for personal use is exempt unless excessive.</li>
                    <li>Debts receivable are zakatable when expected.</li>
                    <li>Allows Zakat in kind or cash.</li>
                    <li>Permits combining family members' wealth for Zakat.</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-lg mb-2 text-blue-800">Final Thoughts</h3>
                <p className="text-sm text-blue-700">
                  In modern contexts, Hanafi opinions are often used for their comprehensive financial coverage. 
                  Seek guidance from local scholars or Islamic financial advisors. Zakat purifies wealth and 
                  fulfills the right of the needy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ZakatCalculatorPage;
