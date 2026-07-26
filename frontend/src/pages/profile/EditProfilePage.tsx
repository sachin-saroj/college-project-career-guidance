import React, { useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormValues } from '../../modules/profile/validators/profile.schema';
import { useProfile, useUpdateProfile } from '../../modules/profile/hooks/useProfile';
import { EditableSection } from '../../components/profile/EditableSection';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      personal: { phone: '', dateOfBirth: '', gender: '' },
      academicInfo: { highestQualification: '', institution: '', boardOrUniversity: '', graduationYear: undefined, percentageOrCgpa: '' },
      careerInterests: { openToRelocation: false, expectedSalaryRange: '', primaryFields: [] },
      socioeconomicDetails: { annualFamilyIncome: '', firstGenerationLearner: false, disabilityStatus: '' }
    }
  });

  // Pre-fill form when data loads
  useEffect(() => {
    if (profileData?.data?.profile) {
      const p = profileData.data.profile;
      reset({
        personal: {
          phone: p.phone || '',
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '', // format for date input
          gender: p.gender || '',
        },
        academicInfo: {
          highestQualification: p.academicInfo?.highestQualification || '',
          institution: p.academicInfo?.institution || '',
          boardOrUniversity: p.academicInfo?.boardOrUniversity || '',
          graduationYear: p.academicInfo?.graduationYear || undefined,
          percentageOrCgpa: p.academicInfo?.percentageOrCgpa || '',
          // Note: arrays like subjects and primaryFields are complex for standard text inputs, 
          // they usually require a tagging component (like Autocomplete). For MVP we omit or handle simply.
        },
        careerInterests: {
          openToRelocation: p.careerInterests?.openToRelocation || false,
          expectedSalaryRange: p.careerInterests?.expectedSalaryRange || '',
          primaryFields: p.careerInterests?.primaryFields || [],
        },
        socioeconomicDetails: {
          annualFamilyIncome: p.socioeconomicDetails?.annualFamilyIncome || '',
          firstGenerationLearner: p.socioeconomicDetails?.firstGenerationLearner || false,
          disabilityStatus: p.socioeconomicDetails?.disabilityStatus || '',
        }
      });
    }
  }, [profileData, reset]);

  const onSubmit = (data: UpdateProfileFormValues) => {
    // Only send the parts of the profile that actually changed, or send all. The backend supports partial updates via PATCH.
    // For simplicity, we send the entire aggregated object matching the PATCH payload structure.
    updateProfile(data, {
      onSuccess: () => navigate('/dashboard/profile')
    });
  };

  if (isProfileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button component={Link} to="/dashboard/profile" variant="text" color="inherit" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Edit Profile
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        
        {/* Personal Info */}
        <EditableSection title="Personal Information" hideEditButton>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="personal.phone" control={control} render={({ field }) => (
                <Input {...field} label="Phone Number" error={!!errors.personal?.phone} helperText={errors.personal?.phone?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="personal.gender" control={control} render={({ field }) => (
                <Input {...field} label="Gender (e.g. Male, Female, Other)" />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="personal.dateOfBirth" control={control} render={({ field }) => (
                <Input {...field} type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
          </Grid>
        </EditableSection>

        {/* Academic Info */}
        <EditableSection title="Academic Information" hideEditButton>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="academicInfo.highestQualification" control={control} render={({ field }) => (
                <Input {...field} label="Highest Qualification" required error={!!errors.academicInfo?.highestQualification} helperText={errors.academicInfo?.highestQualification?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="academicInfo.institution" control={control} render={({ field }) => (
                <Input {...field} label="Institution" required error={!!errors.academicInfo?.institution} helperText={errors.academicInfo?.institution?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="academicInfo.boardOrUniversity" control={control} render={({ field }) => (
                <Input {...field} label="Board / University" />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="academicInfo.graduationYear" control={control} render={({ field }) => (
                <Input {...field} type="number" label="Graduation Year" error={!!errors.academicInfo?.graduationYear} helperText={errors.academicInfo?.graduationYear?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="academicInfo.percentageOrCgpa" control={control} render={({ field }) => (
                <Input {...field} label="Percentage / CGPA" />
              )} />
            </Grid>
          </Grid>
        </EditableSection>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, mb: 8 }}>
          <Button component={Link} to="/dashboard/profile" variant="outlined" disabled={isUpdating}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isUpdating} disabled={!isDirty}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
