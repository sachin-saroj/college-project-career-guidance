import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../../modules/auth/validators/auth.schema';
import { useResetPassword } from '../../modules/auth/hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { mutate: resetPassword, isPending } = useResetPassword();
  
  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', passwordConfirm: '' }
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (token) {
      resetPassword({ token, data });
    }
  };

  // If there's no token in the URL, this page is invalid
  if (!token) {
    return (
      <Card noPadding sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Invalid Reset Link
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This password reset link is invalid or has expired. Please request a new one.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button component={Link} to="/forgot-password" variant="contained" fullWidth>
            Request New Link
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Card noPadding sx={{ p: 4 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create New Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your new password must be different from previous used passwords.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="New Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Confirm New Password"
              type="password"
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
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
            Reset Password
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Back to{' '}
            <MuiLink component={Link} to="/login" fontWeight="bold" underline="hover">
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
