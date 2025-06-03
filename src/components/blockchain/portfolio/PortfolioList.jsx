import React from 'react';
import { Portfolio } from '@/blockchain/services/CommunityPortfolioService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { Users, MapPin, BarChart3 } from "lucide-react";

/**
 * @typedef {Object} PortfolioListProps
 * @property {Array<import('../../../blockchain/services/CommunityPortfolioService').Portfolio>} portfolios - List of portfolios
 * @property {Function} onSelect - Function to handle portfolio selection
 * @property {Object.<string, number>} userContributions - User contributions to portfolios
 * @property {boolean} isLoading - Loading state
 */

const PortfolioList = ({ 
  portfolios, 
  onSelect, 
  userContributions,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-background/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-2 w-full mb-4" />
              <div className="flex justify-between text-sm mb-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between text-sm mb-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No portfolios found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Be the first to create a community-directed impact portfolio
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {portfolios.map(portfolio => {
        // Calculate progress percentage
        const targetAmount = parseFloat(portfolio.targetAmount);
        const currentAmount = parseFloat(portfolio.currentAmount);
        const progressPercentage = targetAmount > 0 
          ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
          : 0;
        
        // Check if user h
        const hasContributed = !!userContributions[portfolio.id];
        
        return (
          <Card 
            key={portfolio.id} 
            className={`bg-background/50 hover:bg-background/70 transition-colors cursor-pointer`}
            onClick={() => onSelect(portfolio)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{portfolio.name}</CardTitle>
                {hasContributed && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    Contributor
                  </span>
                )}
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {portfolio.location}
                <span className="mx-1">•</span>
                <BarChart3 className="h-3 w-3" /> {portfolio.impactCategory}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm line-clamp-2 mb-2">{portfolio.description}</p>
              
              <Progress value={progressPercentage} className="h-2 mb-2" />
              
              <div className="flex justify-between text-sm mb-1">
                <span>Raised:</span>
                <span className="font-medium">{portfolio.currentAmount} / {portfolio.targetAmount} ETH</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Contributors:</span>
                <span className="font-medium">{portfolio.contributorCount}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Created:</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(portfolio.createdAt * 1000), { addSuffix: true })}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(portfolio);
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PortfolioList;
