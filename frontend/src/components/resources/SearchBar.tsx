import React, { useState, useEffect } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search resources..." }) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the input by 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync if prop changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: localValue && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => setLocalValue('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 2,
          '& fieldset': { borderColor: 'divider' },
        }
      }}
      size="small"
    />
  );
};
