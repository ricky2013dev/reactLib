import React from 'react';

const GaugeChart = ({ 
  value = 17, 
  min = 0, 
  max = 100, 
  size = 300,
  thickness = 40,
  segments = [
    { threshold: 17, color: '#ef4444' }, // Red
    { threshold: 50, color: '#fbbf24' }, // Yellow/Orange
    { threshold: 100, color: '#3b82f6' }, // Blue
  ],
  backgroundColor = '#22c55e' // Green for the remaining part
}) => {
  const radius = (size - thickness) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Convert value to angle (gauge spans 180 degrees, from 180 to 360 degrees - bottom semicircle)
  const valueAngle = ((value - min) / (max - min)) * 180 + 180;
  
  // Create path for each segment
  const createSegmentPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + innerRadius * Math.cos(startAngleRad);
    const y1 = centerY + innerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(startAngleRad);
    const y2 = centerY + outerRadius * Math.sin(startAngleRad);
    
    const x3 = centerX + outerRadius * Math.cos(endAngleRad);
    const y3 = centerY + outerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(endAngleRad);
    const y4 = centerY + innerRadius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
  };
  
  // Create needle path
  const needleAngle = valueAngle * Math.PI / 180;
  const needleLength = radius - 40;
  const needleWidth = 10;
  
  const needleX = centerX + needleLength * Math.cos(needleAngle);
  const needleY = centerY + needleLength * Math.sin(needleAngle);
  
  const needleBaseX1 = centerX + needleWidth * Math.cos(needleAngle + Math.PI / 2);
  const needleBaseY1 = centerY + needleWidth * Math.sin(needleAngle + Math.PI / 2);
  const needleBaseX2 = centerX + needleWidth * Math.cos(needleAngle - Math.PI / 2);
  const needleBaseY2 = centerY + needleWidth * Math.sin(needleAngle - Math.PI / 2);
  
  const needlePath = `
    M ${needleBaseX1} ${needleBaseY1}
    L ${needleX} ${needleY}
    L ${needleBaseX2} ${needleBaseY2}
    Z
  `;
  
  const innerRadius = radius - thickness;
  const outerRadius = radius;
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <svg width={size} height={size * 0.55} viewBox={`0 ${size * 0.4} ${size} ${size * 0.6}`} className="overflow-visible">
        {/* Background arc (bottom semicircle in green) */}
        <path
          d={createSegmentPath(180, 360, innerRadius, outerRadius)}
          fill="#22c55e"
        />
        
        {/* Gray segment (0 to current value) */}
        <path
          d={createSegmentPath(180, 180 + (value/max) * 180, innerRadius, outerRadius)}
          fill="#6b7280"
        />
        
        {/* Needle */}
        <path
          d={needlePath}
          fill="#000000"
        />
        
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill="#000000"
        />
        
        {/* Value label next to needle */}
        <text
          x={centerX + (needleLength * 0.7) * Math.cos(needleAngle)}
          y={centerY + (needleLength * 0.7) * Math.sin(needleAngle) - 5}
          fill="#000000"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          className="pointer-events-none"
        >
          {value}
        </text>
        
        {/* Labels */}
        <text
          x={centerX - radius + 15}
          y={centerY - 15}
          fill="#374151"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
        >
          0
        </text>
        
        <text
          x={centerX}
          y={centerY + radius + 20}
          fill="#374151"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
        >
          50
        </text>
        
        <text
          x={centerX + radius - 15}
          y={centerY - 15}
          fill="#374151"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
        >
          100
        </text>
      </svg>
      
      {/* Value display */}
      <div className="mt-4 text-center">
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-600">Current Value</div>
      </div>
    </div>
  );
};

// Demo component showing different values
const GaugeDemo = () => {
  const [currentValue, setCurrentValue] = React.useState(17);
  
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Gauge Chart Component
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <GaugeChart value={currentValue} />
          
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjust Value: {currentValue}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={currentValue}
              onChange={(e) => setCurrentValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[15, 35, 65, 85].map((val) => (
              <button
                key={val}
                onClick={() => setCurrentValue(val)}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {val}
              </button>
            ))}
          </div>
        </div>
        
        {/* Color Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Color Segments</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>0 - {currentValue} (Progress)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>{currentValue} - 100 (Remaining)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeDemo;
