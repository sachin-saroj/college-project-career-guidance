import React from 'react';
import { Box, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface PromptSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
      {suggestions.map((suggestion, idx) => (
        <Chip
          key={idx}
          label={suggestion}
          icon={<AutoAwesomeIcon fontSize="small" />}
          onClick={() => onSelect(suggestion)}
          variant="outlined"
          color="primary"
          sx={{ 
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'primary.50' }
          }}
        />
      ))}
    </Box>
  );
};
