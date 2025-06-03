import React, { useState, useEffect } from 'react';
import { Portfolio, Proposal } from '@/blockchain/services/CommunityPortfolioService';
import communityPortfolioService from '@/blockchain/services/CommunityPortfolioService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  BarChart3, 
  PlusCircle, 
  CheckCircle, 
  XCircle,
  ArrowUpRight,
  Landmark,
  Loader2,
  ExternalLink
} from "lucide-react";

interface PortfolioDetailProps {
  portfolio: Portfolio;
  onBack: () => void;
  onContribute: (portfolioId: number, amount: string) => Promise<void>;
  onProposeInvestment: (params: any) => Promise<void>;
  onVote: (portfolioId: number, proposalId: number, support: boolean) => Promise<void>;
  onExecuteInvestment: (portfolioId: number, proposalId: number) => Promise<void>;
  isLoading: boolean;
}

const PortfolioDetail: React.FC<PortfolioDetailProps> = ({
  portfolio,
  onBack,
  onContribute,
  onProposeInvestment,
  onVote,
  onExecuteInvestment,
  isLoading
}) => {
  const { account } = useWeb3();
  const { toast } = useToast();
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [contributionAmount, setContributionAmount] = useState('0.01');
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
  const [isProposeDialogOpen, setIsProposeDialogOpen] = useState(false);
  const [isUserContributor, setIsUserContributor] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    name: '',
    description: '',
    recipient: '',
    amount: '',
    expectedImpact: ''
  });
  const [loadingProposals, setLoadingProposals] = useState(true);
  
  // Load proposals when component mounts
  useEffect(() => {
    loadProposals();
    checkIfUserIsContributor();
  }, [portfolio.id]);
  
  const loadProposals = async () => {
    setLoadingProposals(true);
    try {
      const portfolioProposals = await communityPortfolioService.getPortfolioProposals(portfolio.id);
      setProposals(portfolioProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load investment proposals',
        variant: 'destructive'
      });
    } finally {
      setLoadingProposals(false);
    }
  };
  
  const checkIfUserIsContributor = async () => {
    if (!account) return;
    
    try {
      const isContributor = await communityPortfolioService.isContributor(portfolio.id);
      setIsUserContributor(isContributor);
    } catch (error) {
      console.error('Error checking if user is contributor:', error);
    }
  };
  
  const handleContributeSubmit = async () => {
    try {
      await onContribute(portfolio.id, contributionAmount);
      setIsContributeDialogOpen(false);
      setContributionAmount('0.01');
    } catch (error) {
      console.error('Error contributing:', error);
    }
  };
  
  const handleProposeSubmit = async () => {
    try {
      await onProposeInvestment({
        portfolioId: portfolio.id,
        ...proposalForm
      });
      setIsProposeDialogOpen(false);
      setProposalForm({
        name: '',
        description: '',
        recipient: '',
        amount: '',
        expectedImpact: ''
      });
      loadProposals();
    } catch (error) {
      console.error('Error proposing investment:', error);
    }
  };
  
  const handleVoteSubmit = async (proposalId: number, support: boolean) => {
    try {
      await onVote(portfolio.id, proposalId, support);
      loadProposals();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };
  
  const handleExecuteSubmit = async (proposalId: number) => {
    try {
      await onExecuteInvestment(portfolio.id, proposalId);
      loadProposals();
    } catch (error) {
      console.error('Error executing investment:', error);
    }
  };
  
  // Calculate progress percentage
  const targetAmount = parseFloat(portfolio.targetAmount);
  const currentAmount = parseFloat(portfolio.currentAmount);
  const progressPercentage = targetAmount > 0 
    ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
    : 0;
  
  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Portfolios
      </Button>
      
      <Card className="bg-background/50 mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{portfolio.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {portfolio.location}
                <span className="mx-1">•</span>
                <BarChart3 className="h-3 w-3" /> {portfolio.impactCategory}
              </CardDescription>
            </div>
            {isUserContributor && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                Contributor
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{portfolio.description}</p>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress:</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 mb-2" />
            <div className="flex justify-between text-sm">
              <span>Raised:</span>
              <span className="font-medium">{portfolio.currentAmount} / {portfolio.targetAmount} ETH</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Contributors</div>
              <div className="text-xl font-medium mt-1 flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                {portfolio.contributorCount}
              </div>
            </div>
            <div className="bg-secondary/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Impact Score</div>
              <div className="text-xl font-medium mt-1 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                {portfolio.totalImpactScore}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">Contribute</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contribute to Portfolio</DialogTitle>
                  <DialogDescription>
                    Support this community-directed impact portfolio with your contribution
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="amount">Contribution Amount (ETH)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                    />
                    <span>ETH</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Minimum contribution: {portfolio.minContribution} ETH
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsContributeDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleContributeSubmit}
                    disabled={
                      isLoading || 
                      parseFloat(contributionAmount) < parseFloat(portfolio.minContribution)
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Contributing...
                      </>
                    ) : (
                      'Contribute'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {isUserContributor && (
              <Dialog open={isProposeDialogOpen} onOpenChange={setIsProposeDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Propose Investment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Propose Investment</DialogTitle>
                    <DialogDescription>
                      Propose a new investment for this community portfolio
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 grid gap-4">
                    <div>
                      <Label htmlFor="name">Investment Name</Label>
                      <Input
                        id="name"
                        value={proposalForm.name}
                        onChange={(e) => setProposalForm({...proposalForm, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={proposalForm.description}
                        onChange={(e) => setProposalForm({...proposalForm, description: e.target.value})}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        value={proposalForm.recipient}
                        onChange={(e) => setProposalForm({...proposalForm, recipient: e.target.value})}
                        className="mt-1"
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount (ETH)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={proposalForm.amount}
                        onChange={(e) => setProposalForm({...proposalForm, amount: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedImpact">Expected Impact</Label>
                      <Textarea
                        id="expectedImpact"
                        value={proposalForm.expectedImpact}
                        onChange={(e) => setProposalForm({...proposalForm, expectedImpact: e.target.value})}
                        className="mt-1"
                        rows={3}
                        placeholder="Describe the expected social impact of this investment..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsProposeDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleProposeSubmit}
                      disabled={
                        isLoading || 
                        !proposalForm.name ||
                        !proposalForm.description ||
                        !proposalForm.recipient ||
                        !proposalForm.amount ||
                        !proposalForm.expectedImpact
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Proposal'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Investment Proposals</h3>
        {loadingProposals ? (
          <div className="grid gap-4">
            {[1, 2].map(i => (
              <Card key={i} className="bg-background/50">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between text-sm mb-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <Card className="bg-background/50 p-6 text-center">
            <Landmark className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No proposals yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {isUserContributor 
                ? "Be the first to propose an investment for this portfolio" 
                : "Contribute to this portfolio to propose investments"}
            </p>
            {isUserContributor && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsProposeDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Propose Investment
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {proposals.map(proposal => (
              <Card key={proposal.id} className="bg-background/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{proposal.name}</CardTitle>
                    {proposal.executed ? (
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                        Executed
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <CardDescription>
                    Proposed by {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)} •{' '}
                    {formatDistanceToNow(new Date(proposal.createdAt * 1000), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-2">{proposal.description}</p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Expected Impact:</span> {proposal.expectedImpact}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-secondary/30 p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="text-xl font-medium mt-1 flex items-center">
                        {proposal.amount} ETH
                      </div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">Votes</div>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          <span>{proposal.yesVotes}</span>
                        </div>
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 mr-1 text-red-500" />
                          <span>{proposal.noVotes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {proposal.impactScore > 0 && (
                    <div className="bg-primary/10 p-3 rounded-md mb-3">
                      <div className="text-sm font-medium text-primary">Impact Report</div>
                      <p className="text-sm mt-1">{proposal.impactMetrics}</p>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Impact Score:</span>
                        <span className="font-medium">{proposal.impactScore}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {proposal.executed ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(`https://etherscan.io/address/${proposal.recipient}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Etherscan
                    </Button>
                  ) : isUserContributor ? (
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleVoteSubmit(proposal.id, false)}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Vote No
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handleVoteSubmit(proposal.id, true)}
                        disabled={isLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Vote Yes
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                    >
                      Contribute to vote
                    </Button>
                  )}
                  
                  {!proposal.executed && 
                   isUserContributor && 
                   proposal.yesVotes > proposal.noVotes && 
                   proposal.yesVotes >= 3 && (
                    <Button 
                      className="w-full mt-2"
                      onClick={() => handleExecuteSubmit(proposal.id)}
                      disabled={isLoading}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Execute Investment
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;
