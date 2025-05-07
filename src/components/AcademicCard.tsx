
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, Share } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AcademicCardProps {
  name: string;
  type: 'school' | 'college' | 'masjid' | 'center';
  location: string;
  distance?: string;
  rating?: number;
  imageSrc?: string;
  className?: string;
}

const AcademicCard: React.FC<AcademicCardProps> = ({
  name,
  type,
  location,
  distance,
  rating,
  imageSrc,
  className,
}) => {
  const { toast } = useToast();

  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: `Share link for ${name} has been copied to clipboard`,
    });
  };

  const handleViewMap = () => {
    toast({
      title: "Opening Map",
      description: `Showing location for ${name}`,
    });
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'school': return 'Islamic School';
      case 'college': return 'Islamic College';
      case 'masjid': return 'Masjid';
      case 'center': return 'Islamic Center';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'school': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'college': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'masjid': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'center': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    }
  };

  return (
    <div 
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border',
        'bg-gradient-to-br from-secondary/40 to-secondary/10 border-white/10',
        'hover:border-lavender/30',
        className
      )}
    >
      <div className="relative h-40 w-full bg-secondary/50">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-lavender/10">
            <span className="text-lavender text-2xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <Badge className={cn("border", getTypeColor())}>
            {getTypeLabel()}
          </Badge>
        </div>
        
        {distance && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-black/30 backdrop-blur-sm border-white/10">
              {distance} away
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-sm text-white/60 mb-3">{location}</p>
        
        {rating && (
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" 
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(rating) ? "text-lavender" : "text-white/20"
                )}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-white/70 ml-2">{rating.toFixed(1)}</span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleViewMap}
            variant="outline" 
            className="flex-1 border-lavender text-lavender hover:bg-lavender/20"
          >
            <Map className="h-4 w-4 mr-2" />
            View Map
          </Button>
          <Button 
            onClick={handleShare}
            variant="outline" 
            className="w-10 p-0 flex items-center justify-center border-white/10 hover:bg-lavender/20"
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcademicCard;
