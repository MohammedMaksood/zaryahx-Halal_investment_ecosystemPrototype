import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw
} from "lucide-react";

// Transaction types - converted from TypeScript type to JSDoc
/**
 * @typedef {'all' | 'sent' | 'received' | 'swap' | 'approve'} TransactionType
 */

// Transaction status - converted from TypeScript type to JSDoc
/**
 * @typedef {'confirmed' | 'pending' | 'failed'} TransactionStatus
 */

// Shariah compliance status - converted from TypeScript type to JSDoc
/**
 * @typedef {'compliant' | 'questionable' | 'non-compliant'} ComplianceStatus
 */

// Transaction interface - converted from TypeScript interface to JSDoc
/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} hash
 * @property {TransactionType} type
 * @property {TransactionStatus} status
 * @property {number} timestamp
 * @property {string} from
 * @property {string} to
 * @property {string} value
 * @property {string} valueUSD
 * @property {string} asset
 * @property {string} [gasUsed]
 * @property {string} [gasFee]
 * @property {number} [blockNumber]
 * @property {ComplianceStatus} complianceStatus
 * @property {Object} [complianceDetails]
 * @property {number} [complianceDetails.score]
 * @property {string[]} [complianceDetails.issues]
 */
// Sample transactions
const sampleTransactions = [
  {
    id: '1',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'sent',
    status: 'confirmed',
    timestamp: Date.now() - 3600000, // 1 hour ago
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    value: '0.5',
    valueUSD: '1000',
    asset: 'ETH',
    gasUsed: '21000',
    gasFee: '0.0021',
    blockNumber: 12345678,
    complianceStatus: 'compliant',
    complianceDetails: {
      score: 95,
      issues: [],
    }
  },
  {
    id: '2',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'received',
    status: 'confirmed',
    timestamp: Date.now() - 86400000, // 1 day ago
    from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: '1.2',
    valueUSD: '2400',
    asset: 'ETH',
    gasUsed: '21000',
    gasFee: '0.0025',
    blockNumber: 12345600,
    complianceStatus: 'compliant',
    complianceDetails: {
      score: 98,
      issues: [],
    }
  },
  {
    id: '3',
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    type: 'swap',
    status: 'confirmed',
    timestamp: Date.now() - 172800000, // 2 days ago
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    value: '0.8',
    valueUSD: '1600',
    asset: 'ETH → ISLA',
    gasUsed: '120000',
    gasFee: '0.012',
    blockNumber: 12345500,
    complianceStatus: 'questionable',
    complianceDetails: {
      score: 75,
      issues: ['Destination token has questionable sources of income'],
    }
  },
  {
    id: '4',
    hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    type: 'approve',
    status: 'confirmed',
    timestamp: Date.now() - 259200000, // 3 days ago
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    value: 'Unlimited',
    valueUSD: 'N/A',
    asset: 'HALAL',
    gasUsed: '45000',
    gasFee: '0.0045',
    blockNumber: 12345400,
    complianceStatus: 'compliant',
    complianceDetails: {
      score: 92,
      issues: [],
    }
  },
  {
    id: '5',
    hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    type: 'sent',
    status: 'failed',
    timestamp: Date.now() - 345600000, // 4 days ago
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    value: '0.3',
    valueUSD: '600',
    asset: 'ETH',
    gasUsed: '10000',
    gasFee: '0.001',
    blockNumber: 12345300,
    complianceStatus: 'non-compliant',
    complianceDetails: {
      score: 30,
      issues: ['Destination is an interest-bearing token contract'],
    }
  },
];

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter transactions based on active tab
  const filteredTransactions = sampleTransactions.filter(tx => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  // Format address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get transaction explorer URL
  const getExplorerUrl = (hash) => {
    // This would be different based on the network
    return `https://etherscan.io/tx/${hash}`;
  };

  // Refresh transactions
  const refreshTransactions = () => {
    setIsLoading(true);
    // In a real implementation, this would fetch the latest transactions
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  // Get compliance icon
  const getComplianceIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'questionable':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'non-compliant':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case 'received':
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-secondary/30 border-white/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your blockchain activity</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-lavender text-lavender hover:bg-lavender/20"
            onClick={refreshTransactions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value )}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="swap">Swaps</TabsTrigger>
            <TabsTrigger value="approve">Approvals</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="p-3 bg-secondary/50 border border-white/10 rounded-lg hover:border-lavender/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getTypeIcon(tx.type)}
                        <span className="ml-1 capitalize">{tx.type}</span>
                        <span className="mx-2 text-white/40">•</span>
                        <span className="text-white/60">{formatTimestamp(tx.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          {getStatusIcon(tx.status)}
                          <span className="ml-1 text-sm capitalize">{tx.status}</span>
                        </span>
                        <a 
                          href={getExplorerUrl(tx.hash)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lavender hover:text-lavender-light"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                      <div>
                        <div className="text-white/60">From</div>
                        <div className="font-medium">{formatAddress(tx.from)}</div>
                      </div>
                      <div>
                        <div className="text-white/60">To</div>
                        <div className="font-medium">{formatAddress(tx.to)}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Value</div>
                        <div className="font-medium">{tx.value} {tx.asset}</div>
                      </div>
                      <div>
                        <div className="text-white/60">USD Value</div>
                        <div className="font-medium">{tx.valueUSD === 'N/A' ? 'N/A' : `$${tx.valueUSD}`}</div>
                      </div>
                    </div>
                    
                    {/* Shariah Compliance Status */}
                    <div className={`mt-2 p-2 rounded-md flex items-start gap-2 text-sm ${
                      tx.complianceStatus === 'compliant' 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : tx.complianceStatus === 'questionable'
                        ? 'bg-yellow-500/10 border border-yellow-500/30'
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}>
                      {getComplianceIcon(tx.complianceStatus)}
                      <div>
                        <div className="font-medium capitalize">
                          {tx.complianceStatus === 'compliant' 
                            ? 'Shariah Compliant' 
                            : tx.complianceStatus === 'questionable'
                            ? 'Questionable Compliance'
                            : 'Non-Compliant'
                          }
                          {tx.complianceDetails && tx.complianceDetails.score !== undefined && tx.complianceDetails.score > 0 && (
                            <span className="ml-1">({tx.complianceDetails.score}/100)</span>
                          )}
                        </div>
                        {tx.complianceDetails && tx.complianceDetails.issues && tx.complianceDetails.issues.length > 0 && (
                          <div className="text-xs mt-1">
                            {tx.complianceDetails.issues.map((issue, i) => (
                              <div key={i} className={`${
                                tx.complianceStatus === 'questionable' 
                                  ? 'text-yellow-400' 
                                  : 'text-red-400'
                              }`}>
                                • {issue}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                No {activeTab === 'all' ? '' : activeTab} transactions found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
