import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, useMediaQuery, useTheme } from '@mui/material';

interface LikertScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

const OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
];

export const LikertScale: React.FC<LikertScaleProps> = ({ value, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <RadioGroup
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      sx={{
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: isMobile ? 2 : 0,
        mt: 4
      }}
    >
      {OPTIONS.map((opt) => (
        <FormControlLabel
          key={opt.value}
          value={opt.value}
          control={<Radio size={isMobile ? 'medium' : 'large'} />}
          label={
            <Typography variant={isMobile ? 'body1' : 'body2'} align="center">
              {opt.label}
            </Typography>
          }
          labelPlacement={isMobile ? 'end' : 'bottom'}
          sx={{
            m: 0,
            flex: isMobile ? 'none' : 1,
            alignItems: 'center',
            '& .MuiFormControlLabel-label': {
              mt: isMobile ? 0 : 1,
              ml: isMobile ? 2 : 0,
            }
          }}
        />
      ))}
    </RadioGroup>
  );
};
