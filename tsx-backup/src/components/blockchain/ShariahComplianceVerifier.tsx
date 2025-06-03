import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/contexts/Web3Context';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  RefreshCw,
  Users,
  FileCheck,
  ExternalLink
} from "lucide-react";

// Scholar verification status
type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';

// Scholar interface
interface Scholar {
  id: string;
  name: string;
  institution: string;
  specialization: string;
  verificationCount: number;
  profileUrl: string;
}

// Verification interface
interface Verification {
  id: string;
  timestamp: number;
  scholar: Scholar;
  status: VerificationStatus;
  comments?: string;
  transactionHash?: string;
}

// Sample scholars
const sampleScholars: Scholar[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Khan',
    institution: 'International Islamic University',
    specialization: 'Islamic Finance',
    verificationCount: 245,
    profileUrl: 'https://example.com/scholars/ahmed-khan',
  },
  {
    id: '2',
    name: 'Dr. Fatima Al-Zahrani',
    institution: 'Global Shariah Advisory Board',
    specialization: 'Fiqh al-Muamalat',
    verificationCount: 189,
    profileUrl: 'https://example.com/scholars/fatima-alzahrani',
  },
  {
    id: '3',
    name: 'Sheikh Abdullah Mahmoud',
    institution: 'Dar Al-Ifta Al-Misriyyah',
    specialization: 'Islamic Commercial Law',
    verificationCount: 312,
    profileUrl: 'https://example.com/scholars/abdullah-mahmoud',
  },
];

// Sample verifications
const sampleVerifications: Verification[] = [
  {
    id: '1',
    timestamp: Date.now() - 86400000, // 1 day ago
    scholar: sampleScholars[0],
    status: 'verified',
    comments: 'This transaction is fully compliant with Shariah principles.',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  {
    id: '2',
    timestamp: Date.now() - 172800000, // 2 days ago
    scholar: sampleScholars[1],
    status: 'pending',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  {
    id: '3',
    timestamp: Date.now() - 259200000, // 3 days ago
    scholar: sampleScholars[2],
    status: 'rejected',
    comments: 'Contains elements of riba (interest) that violate Shariah principles.',
    transactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  },
];

interface ShariahComplianceVerifierProps {
  compact?: boolean;
}

const ShariahComplianceVerifier: React.FC<ShariahComplianceVerifierProps> = ({ compact = false }) => {
  const { toast } = useToast();
  const { isConnected } = useWeb3();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Verification[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedScholars, setSelectedScholars] = useState<string[]>([]);
  const [transactionToVerify, setTransactionToVerify] = useState('');
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery) {
      toast({
        title: "Invalid Input",
        description: "Please enter a transaction hash or address to search",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // In a real implementation, this would query the blockchain
      setSearchResults(sampleVerifications);
      setHasSearched(true);
      setIsSearching(false);
    }, 1500);
  };
  
  // Handle scholar selection
  const handleScholarSelection = (scholarId: string) => {
    if (selectedScholars.includes(scholarId)) {
      setSelectedScholars(selectedScholars.filter(id => id !== scholarId));
    } else {
      setSelectedScholars([...selectedScholars, scholarId]);
    }
  };
  
  // Handle verification submission
  const handleSubmitVerification = () => {
    if (!transactionToVerify) {
      toast({
        title: "Invalid Input",
        description: "Please enter a transaction hash to verify",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedScholars.length === 0) {
      toast({
        title: "No Scholars Selected",
        description: "Please select at least one scholar for verification",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      toast({
        title: "Verification Requested",
        description: `Your transaction has been submitted to ${selectedScholars.length} scholars for verification`,
      });
      
      // Reset form
      setTransactionToVerify('');
      setSelectedScholars([]);
      setIsSubmitting(false);
    }, 2000);
  };
  
  // Get status icon
  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-yellow-400" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'not_submitted':
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Get explorer URL
  const getExplorerUrl = (hash: string) => {
    // This would be different based on the network
    return `https://etherscan.io/tx/${hash}`;
  };

  // If compact is true, render a simplified version
  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-lavender/30 to-lavender/5 border-white/10 hover-lift">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-lavender flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Scholar Verification Network</h3>
              <p className="text-sm text-white/70 mb-3">
                Get your transactions verified by our network of {sampleScholars.length} Islamic scholars
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {sampleScholars.slice(0, 3).map(scholar => (
                  <div key={scholar.id} className="text-xs bg-lavender/20 px-2 py-1 rounded-full text-white/80">
                    {scholar.name}
                  </div>
                ))}
                {sampleScholars.length > 3 && (
                  <div className="text-xs bg-lavender/20 px-2 py-1 rounded-full text-white/80">
                    +{sampleScholars.length - 3} more
                  </div>
                )}
              </div>
              <div className="text-xs text-white/60">
                <span className="text-green-400">{sampleVerifications.filter(v => v.status === 'verified').length} verified</span> • 
                <span className="text-yellow-400">{sampleVerifications.filter(v => v.status === 'pending').length} pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Full component
  return (
    <div className="space-y-6">
      {/* Shariah Compliance Verifier Card */}
      <Card className="bg-gradient-to-br from-lavender/30 to-lavender/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Decentralized Scholar Verification
          </CardTitle>
          <CardDescription className="text-white/60">
            Verify transactions through our network of Islamic scholars
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-6">
              <p className="mb-4 text-white/80">
                Connect your wallet to access the Decentralized Scholar Verification Network
              </p>
              <Button 
                className="bg-lavender hover:bg-lavender-dark"
                disabled
              >
                Wallet Connection Required
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search for existing verifications */}
              <div>
                <h3 className="text-lg font-medium mb-3">Search Existing Verifications</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Transaction hash or address"
                    className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    onClick={handleSearch} 
                    className="bg-lavender hover:bg-lavender-dark"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                
                {hasSearched && (
                  <div className="mt-4">
                    {searchResults.length > 0 ? (
                      <div className="space-y-3">
                        {searchResults.map((verification) => (
                          <div 
                            key={verification.id} 
                            className="p-3 bg-secondary/50 border border-white/10 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {getStatusIcon(verification.status)}
                                <span className="ml-1 capitalize font-medium">
                                  {verification.status}
                                </span>
                                <span className="mx-2 text-white/40">•</span>
                                <span className="text-white/60">
                                  {formatTimestamp(verification.timestamp)}
                                </span>
                              </div>
                              {verification.transactionHash && (
                                <a 
                                  href={getExplorerUrl(verification.transactionHash)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-lavender hover:text-lavender-light"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                            
                            <div className="mb-2">
                              <div className="text-white/60 text-sm">Scholar</div>
                              <div className="font-medium flex items-center">
                                {verification.scholar.name}
                                <span className="mx-2 text-white/40">•</span>
                                <span className="text-sm text-white/60">
                                  {verification.scholar.institution}
                                </span>
                              </div>
                            </div>
                            
                            {verification.comments && (
                              <div className="mb-2">
                                <div className="text-white/60 text-sm">Comments</div>
                                <div className="text-sm">{verification.comments}</div>
                              </div>
                            )}
                            
                            <div className="text-xs text-white/60 flex items-center mt-2">
                              <Users className="h-3 w-3 mr-1" />
                              <span>
                                Scholar has verified {verification.scholar.verificationCount} transactions
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-white/60">
                        No verifications found for this query
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Request new verification */}
              <div>
                <h3 className="text-lg font-medium mb-3">Request New Verification</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transaction Hash</label>
                    <Input
                      placeholder="0x..."
                      className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                      value={transactionToVerify}
                      onChange={(e) => setTransactionToVerify(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Scholars (at least one)</label>
                    <div className="space-y-2">
                      {sampleScholars.map((scholar) => (
                        <div 
                          key={scholar.id} 
                          className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer ${
                            selectedScholars.includes(scholar.id)
                              ? 'bg-lavender/20 border border-lavender/50'
                              : 'bg-secondary/50 border border-white/10 hover:border-lavender/30'
                          }`}
                          onClick={() => handleScholarSelection(scholar.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedScholars.includes(scholar.id)}
                            onChange={() => {}}
                            className="mt-1 h-4 w-4 accent-lavender"
                          />
                          <div>
                            <div className="font-medium">{scholar.name}</div>
                            <div className="text-sm text-white/60">
                              {scholar.institution} • {scholar.specialization}
                            </div>
                            <div className="text-xs text-white/60 flex items-center mt-1">
                              <FileCheck className="h-3 w-3 mr-1" />
                              <span>{scholar.verificationCount} verifications</span>
                              <a 
                                href={scholar.profileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-lavender hover:text-lavender-light flex items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Profile <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitVerification} 
                    className="w-full bg-lavender hover:bg-lavender-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit for Verification'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShariahComplianceVerifier;
