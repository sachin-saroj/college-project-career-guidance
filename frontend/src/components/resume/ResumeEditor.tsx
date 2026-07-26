import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { AIRewriteDialog } from './AIRewriteDialog';
import { Resume } from '../../modules/resume/types/resume.types';
import debounce from 'lodash/debounce';

// We'll define a basic Zod schema for MVP validation
const resumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  careerObjective: z.string().optional(),
  personalInfo: z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(5, 'Phone is required'),
    location: z.string(),
    linkedin: z.string().optional(),
  }),
  experience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
  skills: z.array(z.string()).optional(),
});

interface ResumeEditorProps {
  initialData: Resume;
  onChange: (data: Partial<Resume>) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ initialData, onChange }) => {
  const [aiDialogState, setAiDialogState] = useState<{ open: boolean, text: string, onApply: (t: string) => void }>({ open: false, text: '', onApply: () => {} });

  const { register, control, watch, formState: { errors } } = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData,
    mode: 'onChange'
  });

  // Watch all values to trigger live preview
  const formValues = watch();

  // Debounce the onChange callback to avoid excessive API calls/renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((data: Partial<Resume>) => {
      onChange(data);
    }, 1000),
    [onChange]
  );

  useEffect(() => {
    debouncedOnChange(formValues);
  }, [formValues, debouncedOnChange]);

  const handleAIRewrite = (text: string, applyFn: (newText: string) => void) => {
    setAiDialogState({ open: true, text, onApply: applyFn });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Personal Information</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Input 
            label="Document Title (Internal)" 
            fullWidth 
            {...register('title')} 
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input 
            label="Full Name" 
            fullWidth 
            {...register('personalInfo.fullName')} 
            error={!!errors.personalInfo?.fullName}
            helperText={errors.personalInfo?.fullName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input 
            label="Email" 
            type="email" 
            fullWidth 
            {...register('personalInfo.email')} 
            error={!!errors.personalInfo?.email}
            helperText={errors.personalInfo?.email?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input 
            label="Phone" 
            fullWidth 
            {...register('personalInfo.phone')} 
            error={!!errors.personalInfo?.phone}
            helperText={errors.personalInfo?.phone?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input 
            label="Location (City, Country)" 
            fullWidth 
            {...register('personalInfo.location')} 
          />
        </Grid>
        <Grid item xs={12}>
          <Input 
            label="LinkedIn URL" 
            fullWidth 
            {...register('personalInfo.linkedin')} 
          />
        </Grid>
        <Grid item xs={12}>
          <Input 
            label="Career Objective / Professional Summary" 
            multiline 
            rows={4} 
            fullWidth 
            {...register('careerObjective')} 
          />
        </Grid>
      </Grid>

      <ExperienceEditor control={control} register={register} onAIRewriteClick={handleAIRewrite} />
      
      <EducationEditor control={control} register={register} />

      <AIRewriteDialog 
        open={aiDialogState.open} 
        originalText={aiDialogState.text} 
        onClose={() => setAiDialogState(prev => ({ ...prev, open: false }))}
        onApply={aiDialogState.onApply}
      />
    </Box>
  );
};
