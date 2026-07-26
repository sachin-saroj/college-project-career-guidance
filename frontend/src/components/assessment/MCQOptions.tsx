import React from 'react';
import { RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';

interface MCQOptionsProps {
  options: { text: string; value: number }[];
  value: number | undefined;
  onChange: (value: number) => void;
}

export const MCQOptions: React.FC<MCQOptionsProps> = ({ options, value, onChange }) => {
  return (
    <RadioGroup
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      sx={{ gap: 2 }}
    >
      {options.map((opt) => (
        <Paper
          key={opt.value}
          variant="outlined"
          sx={{
            p: 1,
            borderColor: value === opt.value ? 'primary.main' : 'divider',
            bgcolor: value === opt.value ? 'primary.50' : 'transparent',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
            }
          }}
        >
          <FormControlLabel
            value={opt.value}
            control={<Radio />}
            label={opt.text}
            sx={{ width: '100%', m: 0 }}
          />
        </Paper>
      ))}
    </RadioGroup>
  );
};
