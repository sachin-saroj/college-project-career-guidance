import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../../modules/auth/validators/auth.schema';
import { useLogin } from '../../modules/auth/hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending } = useLogin();
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <Card noPadding sx={{ p: 4 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to continue to CareerSathi
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

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
          <MuiLink component={Link} to="/forgot-password" variant="body2" underline="hover">
            Forgot Password?
          </MuiLink>
        </Box>

        <Button
          type="submit"
          fullWidth
          size="large"
          isLoading={isPending}
        >
          Sign In
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" fontWeight="bold" underline="hover">
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
