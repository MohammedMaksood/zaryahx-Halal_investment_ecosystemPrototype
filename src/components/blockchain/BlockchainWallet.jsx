import React, { useState, useEffect } from 'react';
import '@/styles/transitions.css';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Wallet , 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw
} from "lucide-react";

// Network options
const networks = [
  { id: 1, name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
  { id: 56, name: 'Binance Smart Chain', symbol: 'BNB', icon: '🟡' },
  { id: 137, name: 'Polygon', symbol: 'MATIC', icon: '🟣' },
];

// Shariah-compliant tokens
const shariahTokens = [
  { address: '0x123...', name: 'Islamic Token A', symbol: 'ISLA', decimals: 18, logo: '/tokens/isla.png' },
  { address: '0x456...', name: 'Halal Finance', symbol: 'HALAL', decimals: 18, logo: '/tokens/halal.png' },
  { address: '0x789...', name: 'Ethical Investment', symbol: 'ETHIC', decimals: 18, logo: '/tokens/ethic.png' },
];



const BlockchainWallet = ({ showBalanceOnly = false }) => {
  const { toast } = useToast();
  const { 
    isConnected, 
    isConnecting, 
    connectionError, 
    account, 
    chainId, 
    balance, 
    balanceUSD,
    isShariahCompliant,
    complianceDetails,
    connect, 
    disconnect,
    sendTransaction,
    addToken,
    switchNetwork
  } = useWeb3();

  // Local state
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [showTokensDialog, setShowTokensDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Handle copy to clipboard
  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  // Handle network switch
  const handleNetworkSwitch = async (networkId) => {
    try {
      const success = await switchNetwork(networkId);
      if (success) {
        toast({
          title: "Network Changed",
          description: `Switched to ${networks.find(n => n.id === networkId)?.name}`,
        });
        setShowNetworkDialog(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch network",
        variant: "destructive",
      });
    }
  };

  // Handle send transaction
  const handleSendTransaction = async () => {
    if (!recipientAddress || !sendAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter recipient address and amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const txHash = await sendTransaction(recipientAddress, sendAmount);
      setTransactionSuccess(true);
      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${txHash.slice(0, 10)}...`,
      });
      
      // Reset form after short delay to show success state
      setTimeout(() => {
        setRecipientAddress('');
        setSendAmount('');
        setShowSendDialog(false);
        setTransactionSuccess(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Format account address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get current network
  const currentNetwork = networks.find(n => n.id === chainId) || networks[0];

  // If showBalanceOnly is true, render a simplified version just showing the balance
  if (showBalanceOnly) {
    return (
      <div>
        <h3 className="text-sm font-medium text-white/60">Crypto Balance</h3>
        {isConnected ? (
          <div className="fade-in">
            <p className="text-2xl font-bold mt-1">{balance} {currentNetwork.symbol}</p>
            <p className="text-sm text-white/60">${balanceUSD} USD</p>
          </div>
        ) : (
          <div className="fade-in">
            <p className="text-2xl font-bold mt-1">-</p>
            <Button 
              onClick={connect} 
              size="sm"
              className="mt-2 text-xs px-3 py-1 h-auto button-hover"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <LoadingSpinner size="xs" color="white" />
                  <span className="ml-1">Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="h-3 w-3 mr-1" />
                  Connect
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // Full wallet component
  return (
    <div className="space-y-6">
      {/* Wallet Connection Card */}
      <Card className="w-full bg-secondary/30 backdrop-blur-md border-white/10 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5" />
            Blockchain Wallet
          </CardTitle>
          <CardDescription>
            Connect your wallet to access blockchain features
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-10 fade-in">
              <div className="text-center mb-6">
                <p className="text-white/70 mb-4">
                  Connect your Ethereum wallet to access decentralized features
                </p>
                <Button 
                  onClick={connect} 
                  className="gap-2 button-hover"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <WalletIcon className="h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium flex items-center">
                    {formatAddress(account)}
                    <button 
                      onClick={handleCopyAddress}
                      className="ml-2 text-lavender hover:text-lavender-light"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-white/60 flex items-center mt-1">
                    <span className="mr-2">{currentNetwork.icon} {currentNetwork.name}</span>
                    <button 
                      onClick={() => setShowNetworkDialog(true)}
                      className="text-lavender hover:text-lavender-light"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={disconnect}
                  className="border-lavender text-lavender hover:bg-lavender/20"
                >
                  Disconnect
                </Button>
              </div>
              
              <div className="pt-2">
                <div className="text-2xl font-bold">{balance} {currentNetwork.symbol}</div>
                <div className="text-sm text-white/60">${balanceUSD} USD</div>
              </div>
              
              {/* Shariah Compliance Indicator */}
              <div className={`p-3 rounded-lg flex items-start gap-3 ${
                isShariahCompliant 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-yellow-500/10 border border-yellow-500/30'
              }`}>
                {isShariahCompliant ? (
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-medium">
                    {isShariahCompliant 
                      ? 'Shariah Compliant Wallet' 
                      : 'Potential Compliance Issues'
                    }
                  </div>
                  <div className="text-sm mt-1">
                    {isShariahCompliant 
                      ? `Compliance Score: ${complianceDetails.score}/100` 
                      : complianceDetails.issues.map((issue, i) => (
                          <div key={i} className="text-yellow-400">{issue}</div>
                        ))
                    }
                  </div>
                  <div className="text-xs mt-2 text-white/60">
                    Last verified: {new Date(complianceDetails.lastVerified).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {isConnected && (
          <CardFooter className="flex justify-between">
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto gap-2 button-hover lavender-glow">
                  <ArrowUpRight className="h-4 w-4" />
                  Send
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle>Send {currentNetwork.symbol}</DialogTitle>
                  <DialogDescription>
                    Send {currentNetwork.symbol} to another wallet address
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm">Recipient Address</label>
                    <Input 
                      placeholder="0x..." 
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="focus:border-lavender/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Amount ({currentNetwork.symbol})</label>
                    <Input 
                      type="number" 
                      step="0.001"
                      placeholder="0.01" 
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="focus:border-lavender/50 transition-colors"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSendDialog(false)}
                    className="hover:bg-red-500/10 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendTransaction}
                    disabled={isLoading || !recipientAddress || !sendAmount}
                    className={`relative overflow-hidden transition-all ${transactionSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" className="mr-2" />
                        Processing...
                      </>
                    ) : transactionSuccess ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Sent Successfully
                      </>
                    ) : (
                      'Send Transaction'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto gap-2 button-hover">
                  <ArrowDownLeft className="h-4 w-4" />
                  Receive
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle>Receive {currentNetwork.symbol}</DialogTitle>
                  <DialogDescription>
                    Share your wallet address to receive {currentNetwork.symbol}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-4 fade-in">
                    {account && (
                      <QRCodeSVG 
                        value={account}
                        size={192}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"L"}
                        includeMargin={false}
                      />
                    )}
                  </div>
                  <div className="w-full p-3 bg-secondary/50 border border-white/10 rounded-md flex justify-between items-center relative">
                    <code className="text-sm break-all">{account}</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCopyAddress}
                      className="hover:bg-lavender/20 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {showCopiedToast && (
                      <div className="absolute -top-8 right-0 bg-lavender/90 text-white px-3 py-1 rounded text-xs fade-in">
                        Copied
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReceiveDialog(false)} 
                    className="w-full hover:bg-lavender/10 transition-colors"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>
      
      {isConnected && (
        <>
          {/* Network Selection Dialog */}
          <Dialog open={showNetworkDialog} onOpenChange={setShowNetworkDialog}>
            <DialogContent className="backdrop-blur-md">
              <DialogHeader>
                <DialogTitle>Select Network</DialogTitle>
                <DialogDescription>
                  Choose a blockchain network to connect to
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-3">
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${
                        network.id === chainId
                          ? 'bg-lavender/20 border border-lavender/50'
                          : 'bg-secondary/50 border border-white/10 hover:border-lavender/30'
                      }`}
                      onClick={() => handleNetworkSwitch(network.id)}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{network.icon}</span>
                        <div>
                          <div className="font-medium">{network.name}</div>
                          <div className="text-sm text-white/60">{network.symbol}</div>
                        </div>
                      </div>
                      {network.id === chainId && (
                        <CheckCircle className="h-5 w-5 text-lavender" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Shariah-Compliant Tokens Dialog */}
          <Dialog open={showTokensDialog} onOpenChange={setShowTokensDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-lavender text-lavender hover:bg-lavender/20"
              >
                <Shield className="mr-2 h-4 w-4" /> View Shariah-Compliant Tokens
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-md">
              <DialogHeader>
                <DialogTitle>Shariah-Compliant Tokens</DialogTitle>
                <DialogDescription>
                  Add these verified tokens to your wallet
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-3">
                  {shariahTokens.map((token) => (
                    <div 
                      key={token.address} 
                      className="p-3 bg-secondary/50 border border-white/10 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-lavender/30 rounded-full mr-3 flex items-center justify-center">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-white/60">{token.symbol}</div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-lavender text-lavender hover:bg-lavender/20"
                        onClick={() => addToken(token.address, token.symbol, token.decimals, token.logo)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default BlockchainWallet;
