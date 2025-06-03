import React from 'react';

// Fallback chart component that displays a simple price chart
const CandlestickChart = ({ 
  data, 
  width = 800,
  height = 300 
}) => {
  // If no data is provided, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-secondary/20 rounded-md border border-white/10">
        <p className="text-black">No price data available</p>
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
  const barWidth = 12; // Wider bars for better visibility
  const spacing = 6; // More spacing between bars
  const totalWidth = Math.max(width, (barWidth + spacing) * data.length); // Ensure minimum width
  
  // Function to scale a price to a y-coordinate
  const scaleY = (price) => {
    return chartHeight - ((price - minPrice + padding) / (range + padding * 2)) * chartHeight;
  };

  return (
    <div className="candlestick-chart w-full rounded-md overflow-hidden bg-secondary/20 p-4 border border-white/10">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-black">Price: ${data[data.length - 1].close.toFixed(2)}</span>
        <span className="text-xs text-black">
          Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
        </span>
      </div>
      
      <div style={{ height: `${chartHeight}px`, position: 'relative', overflowX: 'auto', width: '100%' }}>
        <svg width={totalWidth} height={chartHeight} className="block min-w-full" preserveAspectRatio="xMidYMid meet">
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
        <span className="text-xs text-black">{data[0].time}</span>
        <span className="text-xs text-black">{data[data.length - 1].time}</span>
      </div>
    </div>
  );
};

export default CandlestickChart;
