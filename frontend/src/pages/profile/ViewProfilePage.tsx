import React from 'react';
import { Box, Typography, CircularProgress, Grid, Chip, Divider } from '@mui/material';
import { useProfile } from '../../modules/profile/hooks/useProfile';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { AvatarUploader } from '../../components/profile/AvatarUploader';
import { useAuthStore } from '../../store/auth.store';

export const ViewProfilePage: React.FC = () => {
  const { data, isLoading } = useProfile();
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const profile = data?.data?.profile;

  const renderField = (label: string, value?: string | number | boolean) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">
        {value === undefined || value === '' ? (
          <Typography component="span" variant="body2" color="text.disabled" fontStyle="italic">Not provided</Typography>
        ) : typeof value === 'boolean' ? (
          value ? 'Yes' : 'No'
        ) : (
          value
        )}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          My Profile
        </Typography>
        <Button component={Link} to="/dashboard/profile/edit" startIcon={<EditIcon />}>
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Avatar & Basic Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <AvatarUploader 
                currentAvatarUrl={profile?.avatarUrl} 
                name={`${user?.firstName} ${user?.lastName}`} 
              />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Chip 
              label={profile?.isProfileComplete ? 'Complete' : 'Incomplete'} 
              color={profile?.isProfileComplete ? 'success' : 'warning'} 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>

        {/* Right Column: Detailed Sections */}
        <Grid item xs={12} md={8}>
          <Card title="Personal Information" sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2, mt: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>{renderField('Phone Number', profile?.phone)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('Gender', profile?.gender)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('Date of Birth', profile?.dateOfBirth)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('Country', profile?.address?.country)}</Grid>
            </Grid>
          </Card>

          <Card title="Academic Information" sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2, mt: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>{renderField('Highest Qualification', profile?.academicInfo?.highestQualification)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('Institution', profile?.academicInfo?.institution)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('Graduation Year', profile?.academicInfo?.graduationYear)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('Percentage / CGPA', profile?.academicInfo?.percentageOrCgpa)}</Grid>
            </Grid>
            {profile?.academicInfo?.subjects && profile.academicInfo.subjects.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Subjects
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.academicInfo.subjects.map((sub, i) => (
                    <Chip key={i} label={sub} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Card>

          <Card title="Career Interests" sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2, mt: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>{renderField('Open to Relocation', profile?.careerInterests?.openToRelocation)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('Expected Salary', profile?.careerInterests?.expectedSalaryRange)}</Grid>
            </Grid>
            
            {profile?.careerInterests?.primaryFields && profile.careerInterests.primaryFields.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Primary Fields of Interest
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.careerInterests.primaryFields.map((field, i) => (
                    <Chip key={i} label={field} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Card>

          <Card title="Socioeconomic Details" sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2, mt: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>{renderField('Annual Family Income', profile?.socioeconomicDetails?.annualFamilyIncome)}</Grid>
              <Grid item xs={12} sm={6}>{renderField('First Generation Learner', profile?.socioeconomicDetails?.firstGenerationLearner)}</Grid>
              <Grid item xs={12}>{renderField('Disability Status', profile?.socioeconomicDetails?.disabilityStatus)}</Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
