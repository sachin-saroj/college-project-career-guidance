import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';
import { Card } from '../ui/Card';

interface TraitData {
  trait: string;
  score: number;
}

interface RadarChartCardProps {
  data: TraitData[];
}

export const RadarChartCard: React.FC<RadarChartCardProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Card title="Trait Analysis" sx={{ height: '100%', minHeight: 400 }}>
      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke={theme.palette.divider} />
            <PolarAngleAxis 
              dataKey="trait" 
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: theme.palette.text.disabled }}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 8, 
                border: 'none', 
                boxShadow: theme.shadows[3] 
              }} 
            />
            <Radar
              name="Student"
              dataKey="score"
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.main}
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
