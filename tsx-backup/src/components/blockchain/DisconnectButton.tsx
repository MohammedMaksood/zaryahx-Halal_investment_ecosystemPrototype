import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useWeb3 } from '@/contexts/Web3Context';
import LoadingSpinner from '@/components/ui/loading-spinner';

const DisconnectButton: React.FC = () => {
  const { isConnected, disconnect } = useWeb3();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  if (!isConnected) return null;
  
  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    
    // Add a small delay to show the animation
    // In a real implementation, this would be the actual disconnection time
    setTimeout(() => {
      disconnect();
      setIsDisconnecting(false);
    }, 800);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleDisconnect}
      disabled={isDisconnecting}
      className="text-white/60 hover:text-white hover:bg-red-500/20 transition-colors relative"
    >
      {isDisconnecting ? (
        <>
          <LoadingSpinner size="xs" color="white" className="mr-1" />
          <span className="animate-pulse">Disconnecting...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-1" />
          Disconnect
        </>
      )}
    </Button>
  );
};

export default DisconnectButton;
