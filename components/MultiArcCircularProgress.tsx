
import React from 'react';

interface Segment {
  value: number; // percentage
  color: string;
}

interface MultiArcCircularProgressProps {
  segments: Segment[];
  size: number;
  strokeWidth: number;
  trailColor?: string;
}

const MultiArcCircularProgress: React.FC<MultiArcCircularProgressProps> = ({
  segments,
  size,
  strokeWidth,
  trailColor = 'rgba(255, 255, 255, 0.1)',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trailColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {segments.map((segment, index) => {
        const offset = circumference - (accumulatedPercentage / 100) * circumference;
        const dash = (segment.value / 100) * circumference;
        accumulatedPercentage += segment.value;

        return (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={segment.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export default MultiArcCircularProgress;
