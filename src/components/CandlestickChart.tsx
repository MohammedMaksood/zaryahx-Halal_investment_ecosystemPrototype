import React from 'react';

interface CandlestickChartProps {
  data: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  width?: number;
  height?: number;
}

// Fallback chart component that displays a simple price chart
const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  data, 
  height = 300 
}) => {
  // If no data is provided, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-secondary/20 rounded-md border border-white/10">
        <p className="text-white/60">No price data available</p>
      </div>
    );
  }

  // Get min and max values for scaling
  const prices = data.flatMap(item => [item.high, item.low]);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const range = maxPrice - minPrice;
  const padding = range * 0.1; // 10% padding
  
  // Calculate chart dimensions
  const chartHeight = height - 40; // Leave space for labels
  const barWidth = 10;
  const spacing = 5;
  const totalWidth = (barWidth + spacing) * data.length;
  
  // Function to scale a price to a y-coordinate
  const scaleY = (price: number) => {
    return chartHeight - ((price - minPrice + padding) / (range + padding * 2)) * chartHeight;
  };

  return (
    <div className="candlestick-chart w-full rounded-md overflow-hidden bg-secondary/20 p-4 border border-white/10">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-white/60">Price: ${data[data.length - 1].close.toFixed(2)}</span>
        <span className="text-xs text-white/60">
          Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
        </span>
      </div>
      
      <div style={{ height: `${chartHeight}px`, position: 'relative', overflowX: 'auto' }}>
        <svg width={totalWidth} height={chartHeight} className="block">
          {/* Draw price lines */}
          <line 
            x1="0" 
            y1={scaleY(minPrice)} 
            x2={totalWidth} 
            y2={scaleY(minPrice)} 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeDasharray="4" 
          />
          <line 
            x1="0" 
            y1={scaleY(maxPrice)} 
            x2={totalWidth} 
            y2={scaleY(maxPrice)} 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeDasharray="4" 
          />
          <line 
            x1="0" 
            y1={scaleY((maxPrice + minPrice) / 2)} 
            x2={totalWidth} 
            y2={scaleY((maxPrice + minPrice) / 2)} 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeDasharray="4" 
          />
          
          {/* Draw candlesticks */}
          {data.map((item, index) => {
            const x = index * (barWidth + spacing);
            const open = scaleY(item.open);
            const close = scaleY(item.close);
            const high = scaleY(item.high);
            const low = scaleY(item.low);
            const isUp = item.close >= item.open;
            const color = isUp ? '#4CAF50' : '#F44336';
            
            return (
              <g key={index}>
                {/* Wick */}
                <line 
                  x1={x + barWidth/2} 
                  y1={high} 
                  x2={x + barWidth/2} 
                  y2={low} 
                  stroke={color} 
                  strokeWidth="1" 
                />
                
                {/* Body */}
                <rect 
                  x={x} 
                  y={isUp ? open : close} 
                  width={barWidth} 
                  height={Math.abs(close - open) || 1} 
                  fill={color} 
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-xs text-white/60">{data[0].time}</span>
        <span className="text-xs text-white/60">{data[data.length - 1].time}</span>
      </div>
    </div>
  );
};

export default CandlestickChart;
