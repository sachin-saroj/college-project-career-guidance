import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export type InputProps = TextFieldProps & {
  // Can add custom CareerSathi specific props here later if needed
};

export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  return (
    <TextField
      ref={ref}
      variant="outlined"
      fullWidth
      margin="normal"
      {...props}
      InputLabelProps={{
        shrink: true, // Forces labels to float above inputs for cleaner modern aesthetic
        ...props.InputLabelProps,
      }}
    />
  );
});

Input.displayName = 'Input';
