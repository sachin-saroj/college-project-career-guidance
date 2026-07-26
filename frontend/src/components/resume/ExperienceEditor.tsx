import React from 'react';
import { Box, Typography, IconButton, Grid, Divider } from '@mui/material';
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Resume } from '../../modules/resume/types/resume.types';

interface ExperienceEditorProps {
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  onAIRewriteClick: (text: string, onApply: (newText: string) => void) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ control, register, onAIRewriteClick }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Experience</Typography>
        <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => append({ role: '', company: '', startDate: '', current: false, description: [''] })}>
          Add Experience
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
              <Input label="Role" fullWidth {...register(`experience.${index}.role`)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input label="Company" fullWidth {...register(`experience.${index}.company`)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register(`experience.${index}.startDate`)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register(`experience.${index}.endDate`)} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>Description (Bullet Points)</Typography>
              </Box>
              {/* Very simplified dynamic description array for MVP */}
              <Input 
                multiline 
                rows={4} 
                fullWidth 
                placeholder="Separate bullet points with new lines"
                {...register(`experience.${index}.description.0`)} 
              />
              <Button 
                size="small" 
                startIcon={<AutoAwesomeIcon />} 
                onClick={() => {
                  // This is a hacky way to access the current value without watch in MVP
                  // In a real app we'd use useWatch or pass the string up.
                  const el = document.querySelector(`[name="experience.${index}.description.0"]`) as HTMLTextAreaElement;
                  if (el) {
                    onAIRewriteClick(el.value, (newText) => {
                      // Apply changes via react-hook-form setValue or direct element edit and trigger event
                      el.value = newText;
                      // Trigger react-hook-form onChange
                      const event = new Event('input', { bubbles: true });
                      el.dispatchEvent(event);
                    });
                  }
                }}
                sx={{ mt: 1 }}
              >
                AI Rewrite bullets
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
      
      {fields.length > 0 && <Divider sx={{ my: 3 }} />}
    </Box>
  );
};
