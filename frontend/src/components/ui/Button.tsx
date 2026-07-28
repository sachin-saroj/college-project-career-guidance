import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'disableElevation'> {
  isLoading?: boolean;
  to?: string;
  component?: React.ElementType<any>;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading = false, 
  disabled, 
  variant = 'contained', 
  color = 'primary', 
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled || isLoading}
      disableElevation
      sx={{
        position: 'relative',
        minWidth: 120, // Prevents layout shifts during loading state
        ...props.sx
      }}
      {...props}
    >
      {isLoading ? (
        <CircularProgress
          size={24}
          color="inherit"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      ) : (
        children
      )}
    </MuiButton>
  );
};
