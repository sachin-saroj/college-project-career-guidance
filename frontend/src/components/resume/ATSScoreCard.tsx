import React from 'react';
import { Box, Typography, Paper, CircularProgress, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAnalyzeResume } from '../../modules/resume/hooks/useResume';

interface ATSScoreCardProps {
  resumeId: string;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ resumeId }) => {
  const { data, isLoading, error } = useAnalyzeResume(resumeId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'error.50', color: 'error.main' }}>
        <Typography variant="body2">Failed to load ATS analysis.</Typography>
      </Paper>
    );
  }

  const { score, keywordMatch, readability, missingKeywords, suggestions } = data.data;

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'success.main';
    if (s >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">ATS Analysis</Typography>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={score} size={64} sx={{ color: getScoreColor(score) }} thickness={5} />
          <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" component="div" fontWeight="bold" color="text.secondary">
              {Math.round(score)}%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1, textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h5" color={getScoreColor(keywordMatch)}>{keywordMatch}%</Typography>
          <Typography variant="caption" color="text.secondary">Keywords</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h5" color={getScoreColor(readability)}>{readability}%</Typography>
          <Typography variant="caption" color="text.secondary">Readability</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {missingKeywords.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error.main">
            Missing Important Keywords
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {missingKeywords.map((kw, i) => (
              <Chip key={i} label={kw} size="small" variant="outlined" color="error" />
            ))}
          </Box>
        </Box>
      )}

      {suggestions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Suggestions for Improvement
          </Typography>
          <List dense disablePadding>
            {suggestions.map((suggestion, i) => (
              <ListItem key={i} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                  <ErrorOutlineIcon color="warning" sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary={suggestion} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {score >= 80 && suggestions.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', mt: 2 }}>
          <CheckCircleOutlineIcon fontSize="small" />
          <Typography variant="body2" fontWeight="medium">Your resume is well optimized!</Typography>
        </Box>
      )}
    </Paper>
  );
};
