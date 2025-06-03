import React, { useState, useEffect, useRef } from 'react';
import '@/styles/transitions.css';
import BlockchainAnimation from '@/components/ui/blockchain-animation';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ethers } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';
import communityPortfolioService, { 
  Portfolio, 
  Proposal, 
  CreatePortfolioParams,
  ProposeInvestmentParams
} from '@/blockchain/services/CommunityPortfolioService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  PlusCircle, 
  ArrowUpRight, 
  Landmark, 
  BarChart3, 
  CheckCircle, 
  XCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import PortfolioList from './portfolio/PortfolioList';
import PortfolioDetail from './portfolio/PortfolioDetail';
import CreatePortfolioForm from './portfolio/CreatePortfolioForm';

const CommunityPortfolio = () => {
  const { account, isConnected, connect } = useWeb3();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('explore');
  /**
   * @type {Array<import('../../blockchain/services/CommunityPortfolioService').Portfolio>}
   */
  const [portfolios, setPortfolios] = useState([]);
  /**
   * @type {import('../../blockchain/services/CommunityPortfolioService').Portfolio | null}
   */
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  /**
   * @type {Object.<number, string>}
   */
  const [userContributions, setUserContributions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  /**
   * @type {'pending' | 'success' | 'error' | null}
   */
  const [transactionStatus, setTransactionStatus] = useState(null);
  /**
   * @type {'transaction' | 'connection' | 'verification'}
   */
  const [animationType, setAnimationType] = useState('transaction');
  const [showAnimation, setShowAnimation] = useState(false);
  /**
   * @type {NodeJS.Timeout | null}
   */
  const timeoutRef = useRef(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Load portfolios when component mounts
  useEffect(() => {
    const initializeService = async () => {
      if (isConnected) {
        try {
          // We'll use window.ethereum directly since it's not exposed in the context
          if (window.ethereum) {
            setAnimationType('connection');
            setTransactionStatus('pending');
            setShowAnimation(true);
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            communityPortfolioService.initialize(provider);
            await loadPortfolios();
            
            setTransactionStatus('success');
            timeoutRef.current = setTimeout(() => {
              setShowAnimation(false);
            }, 2000);
          } else {
            setTransactionStatus('error');
            toast({
              title: "Ethereum provider not found",
              description: "Please install MetaMask or another Web3 wallet",
              variant: "destructive"
            });
            timeoutRef.current = setTimeout(() => {
              setShowAnimation(false);
            }, 2000);
          }
        } catch (error) {
          console.error("Error initializing community portfolio service:", error);
          setTransactionStatus('error');
          toast({
            title: "Connection Error",
            description: "Could not connect to blockchain network",
            variant: "destructive"
          });
          timeoutRef.current = setTimeout(() => {
            setShowAnimation(false);
          }, 2000);
        }
      }
    };
    
    initializeService();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isConnected]);
  
  // Load user contributions when account changes
  useEffect(() => {
    if (account && isConnected) {
      loadUserContributions();
    }
  }, [account, isConnected]);
  
  const loadPortfolios = async () => {
    setIsLoading(true);
    try {
      const allPortfolios = await communityPortfolioService.getAllPortfolios();
      setPortfolios(allPortfolios);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      toast({
        title: 'Error',
        description: 'Failed to load community portfolios',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadUserContributions = async () => {
    if (!account) return;
    
    try {
      const contributions = await communityPortfolioService.getUserContributions(account);
      const contributionMap= {};
      
      contributions.forEach(contribution => {
        contributionMap[contribution.portfolioId] = contribution.amount;
      });
      
      setUserContributions(contributionMap);
    } catch (error) {
      console.error('Error loading user contributions:', error);
    }
  };
  
  const handleCreatePortfolio = async (params) => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setAnimationType('transaction');
    setTransactionStatus('pending');
    setShowAnimation(true);
    
    try {
      await communityPortfolioService.createPortfolio(params);
      setTransactionStatus('success');
      toast({
        title: 'Success',
        description: 'Community portfolio created successfully',
        variant: 'default'
      });
      await loadPortfolios();
      setCreateDialogOpen(false);
      
      timeoutRef.current = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setTransactionStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to create community portfolio',
        variant: 'destructive'
      });
      
      timeoutRef.current = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setActiveTab('details');
  };
  
  const handleBackToList = () => {
    setSelectedPortfolio(null);
    setActiveTab('explore');
  };
  
  const handleContribute = async (portfolioId, amount) => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setAnimationType('transaction');
    setTransactionStatus('pending');
    setShowAnimation(true);
    
    try {
      await communityPortfolioService.contribute(portfolioId, amount);
      setTransactionStatus('success');
      toast({
        title: 'Success',
        description: `Successfully contributed ${amount} ETH to the community portfolio`,
        variant: 'default'
      });
      await loadPortfolios();
      await loadUserContributions();
      
      timeoutRef.current = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    } catch (error) {
      console.error('Error contributing to portfolio:', error);
      setTransactionStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to contribute to the community portfolio',
        variant: 'destructive'
      });
      
      timeoutRef.current = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProposeInvestment = async (params) => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setAnimationType('verification');
    setTransactionStatus('pending');
    setShowAnimation(true);

    try {
      await communityPortfolioService.proposeInvestment(params);
      setTransactionStatus('success');
      toast({
        title: 'Success',
        description: 'Investment proposal submitted successfully',
        variant: 'default'
      });

      if (selectedPortfolio) {
        const updatedPortfolio = await communityPortfolioService.getPortfolio(selectedPortfolio.id);
        setSelectedPortfolio(updatedPortfolio);
      }

      timeoutRef.current = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    } catch (error) {
      console.error('Error proposing investment:', error);
      setTransactionStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to submit investment proposal',
        variant: 'destructive'
      });

      timeoutRef.current = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (portfolioId, proposalId, support) => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      await communityPortfolioService.vote(portfolioId, proposalId, support);
      toast({
        title: 'Success',
        description: `Successfully voted ${support ? 'in favor of' : 'against'} the proposal`,
        variant: 'default'
      });

      if (selectedPortfolio && selectedPortfolio.id === portfolioId) {
        const updatedPortfolio = await communityPortfolioService.getPortfolio(portfolioId);
        if (updatedPortfolio) {
          setSelectedPortfolio(updatedPortfolio);
        }
      }
    } catch (error) {
      console.error('Error voting on proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your vote',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteInvestment = async (portfolioId, proposalId) => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      await communityPortfolioService.executeInvestment(portfolioId, proposalId);
      toast({
        title: 'Success',
        description: 'Investment executed successfully',
        variant: 'default'
      });

      if (selectedPortfolio && selectedPortfolio.id === portfolioId) {
        const updatedPortfolio = await communityPortfolioService.getPortfolio(portfolioId);
        if (updatedPortfolio) {
          setSelectedPortfolio(updatedPortfolio);
        }
      }
    } catch (error) {
      console.error('Error executing investment:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute the investment',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="w-full relative">
        <Card className="w-full bg-secondary/30 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community-Directed Impact Portfolios
            </CardTitle>
            <CardDescription>
              Create and participate in community-driven investment portfolios for local challenges
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Connect your wallet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You need to connect your wallet to access Community-Directed Impact Portfolios
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {showAnimation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary/80 p-8 rounded-lg shadow-xl flex flex-col items-center">
            <BlockchainAnimation 
              type={animationType} 
              status={transactionStatus || 'pending'} 
              size="lg" 
            />
            <div className="mt-4 text-center">
              {transactionStatus === 'pending' && (
                <p className="text-white fade-in">Processing blockchain transaction...</p>
              )}
              {transactionStatus === 'success' && (
                <p className="text-green-400 fade-in">Transaction successful</p>
              )}
              {transactionStatus === 'error' && (
                <p className="text-red-400 fade-in">Transaction failed. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="explore" className="transition-all hover:bg-lavender/20">
            <Users className="mr-2 h-4 w-4" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedPortfolio} className="transition-all hover:bg-lavender/20">
            <BarChart3 className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="my-contributions" className="transition-all hover:bg-lavender/20">
            <Landmark className="mr-2 h-4 w-4" />
            My Contributions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-4 fade-in">
          {selectedPortfolio ? (
            <PortfolioDetail 
              portfolio={selectedPortfolio}
              onBack={handleBackToList}
              onContribute={handleContribute}
              onProposeInvestment={handleProposeInvestment}
              onVote={handleVote}
              onExecuteInvestment={handleExecuteInvestment}
              isLoading={isLoading}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Community Portfolios</h2>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="button-hover lavender-glow">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Portfolio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle>Create Community Portfolio</DialogTitle>
                      <DialogDescription>
                        Create a new community-directed impact portfolio for your community
                      </DialogDescription>
                    </DialogHeader>
                    
                    <CreatePortfolioForm onSubmit={handleCreatePortfolio} isLoading={isLoading} />
                  </DialogContent>
                </Dialog>
              </div>
              
              {isLoading && !showAnimation ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" color="lavender" />
                </div>
              ) : (
                <PortfolioList 
                  portfolios={portfolios} 
                  onSelect={handleSelectPortfolio} 
                  userContributions={userContributions}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="my-contributions" className="space-y-4 fade-in">
          <h2 className="text-2xl font-bold mb-4">My Contributions</h2>
          
          {Object.keys(userContributions).length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You haven't contributed to any portfolios yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('explore')}
              >
                Explore Portfolios
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {portfolios
                .filter(portfolio => userContributions[portfolio.id])
                .map(portfolio => (
                  <Card key={portfolio.id} className="bg-background/50 hover:bg-background/70 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{portfolio.name}</CardTitle>
                      <CardDescription>{portfolio.location} • {portfolio.impactCategory}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between text-sm">
                        <span>Your contribution:</span>
                        <span className="font-medium">{userContributions[portfolio.id]} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Total raised:</span>
                        <span>{portfolio.currentAmount} / {portfolio.targetAmount} ETH</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleSelectPortfolio(portfolio)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPortfolio;
