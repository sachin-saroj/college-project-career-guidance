import React from 'react';
import { Box, Typography, IconButton, Grid, Divider } from '@mui/material';
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Resume } from '../../modules/resume/types/resume.types';

interface EducationEditorProps {
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Education</Typography>
        <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => append({ degree: '', institution: '', startYear: new Date().getFullYear() })}>
          Add Education
        </Button>
      </Box>

      {fields.map((field, index) => (
        <Box key={field.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton size="small" color="error" onClick={() => remove(index)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Input label="Degree / Course" fullWidth {...register(`education.${index}.degree`)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input label="Institution" fullWidth {...register(`education.${index}.institution`)} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Input label="Start Year" type="number" fullWidth {...register(`education.${index}.startYear`, { valueAsNumber: true })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Input label="End Year (Expected)" type="number" fullWidth {...register(`education.${index}.endYear`, { valueAsNumber: true })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Input label="Percentage / CGPA" type="number" fullWidth {...register(`education.${index}.percentage`, { valueAsNumber: true })} />
            </Grid>
          </Grid>
        </Box>
      ))}
      
      {fields.length > 0 && <Divider sx={{ my: 3 }} />}
    </Box>
  );
};
