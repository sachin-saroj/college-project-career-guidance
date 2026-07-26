import React, { useState } from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../../modules/auth/validators/auth.schema';
import { useForgotPassword } from '../../modules/auth/hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export const ForgotPasswordPage: React.FC = () => {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();
  const [emailSent, setEmailSent] = useState('');
  
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setEmailSent(data.email);
    forgotPassword(data);
  };

  if (isSuccess) {
    return (
      <Card noPadding sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <MarkEmailReadIcon color="success" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Check your email
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We've sent a password reset link to <strong>{emailSent}</strong>. 
          Please check your inbox and spam folder.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} to="/login" variant="outlined" fullWidth>
            Back to Login
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Card noPadding sx={{ p: 4 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Email Address"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            type="submit"
            fullWidth
            size="large"
            isLoading={isPending}
          >
            Send Reset Link
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Remembered your password?{' '}
            <MuiLink component={Link} to="/login" fontWeight="bold" underline="hover">
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
