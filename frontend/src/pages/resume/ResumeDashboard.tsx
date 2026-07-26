import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, CardActions, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageIcon from '@mui/icons-material/Language';
import { Button } from '../../components/ui/Button';
import { useResumes, useCreateResume, useDeleteResume } from '../../modules/resume/hooks/useResume';

export const ResumeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: resumesRes, isLoading } = useResumes();
  const { mutate: createResume, isPending: isCreating } = useCreateResume();
  const { mutate: deleteResume } = useDeleteResume();

  const resumes = resumesRes?.data || [];

  const handleCreate = () => {
    createResume({
      title: 'Untitled Resume',
      templateId: 'modern',
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: ''
      },
      careerObjective: '',
      education: [],
      experience: [],
      projects: [],
      skills: []
    }, {
      onSuccess: (res) => {
        navigate(`/builder/resume/${res.data._id}`);
      }
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Resumes & Portfolio</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<LanguageIcon />} onClick={() => navigate('/builder/portfolio')}>
            Manage Portfolio
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} disabled={isCreating}>
            New Resume
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : resumes.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>No resumes found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first resume to start applying for opportunities.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Create Resume
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {resumes.map((resume) => (
            <Grid item xs={12} sm={6} md={4} key={resume._id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {resume.title || 'Untitled Resume'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Target: {resume.targetCareerId || 'General Application'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ borderTop: '1px solid', borderColor: 'divider', justifyContent: 'space-between' }}>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/builder/resume/${resume._id}`)}>
                    Edit
                  </Button>
                  <IconButton size="small" color="error" onClick={() => {
                    if (window.confirm('Are you sure you want to delete this resume?')) {
                      deleteResume(resume._id);
                    }
                  }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
