import React from 'react';
import { Box, Typography, Link as MuiLink, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../../modules/auth/validators/auth.schema';
import { useRegister } from '../../modules/auth/hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const RegisterPage: React.FC = () => {
  const { mutate: registerUser, isPending } = useRegister();
  
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', passwordConfirm: '' }
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data);
  };

  return (
    <Card noPadding sx={{ p: 4 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Join CareerSathi to kickstart your journey
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Grid>
        </Grid>

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

        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Confirm Password"
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
            Sign Up
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" fontWeight="bold" underline="hover">
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
