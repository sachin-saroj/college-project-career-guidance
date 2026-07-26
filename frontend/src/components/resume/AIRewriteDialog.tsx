import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, CircularProgress } from '@mui/material';
import { Button } from '../ui/Button';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAIRewrite } from '../../modules/resume/hooks/useResume';

interface AIRewriteDialogProps {
  open: boolean;
  onClose: () => void;
  originalText: string;
  onApply: (newText: string) => void;
}

export const AIRewriteDialog: React.FC<AIRewriteDialogProps> = ({ open, onClose, originalText, onApply }) => {
  const { mutate: rewrite, isPending } = useAIRewrite();
  const [result, setResult] = useState<string | null>(null);

  const handleRewrite = () => {
    rewrite(originalText, {
      onSuccess: (res) => {
        setResult(res.data);
      }
    });
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
    }
    handleClose();
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon color="primary" /> AI Resume Assistant
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">Original Text</Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mt: 1, whiteSpace: 'pre-wrap' }}>
            <Typography variant="body2">{originalText}</Typography>
          </Box>
        </Box>

        {isPending ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">Analyzing and rewriting for ATS optimization...</Typography>
          </Box>
        ) : result ? (
          <Box>
            <Typography variant="caption" color="primary.main" fontWeight="bold">AI Suggestion</Typography>
            <Box sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', borderRadius: 1, mt: 1, whiteSpace: 'pre-wrap' }}>
              <Typography variant="body2">{result}</Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              I can help rewrite your bullet points using the STAR method, fix grammar, and optimize for ATS keywords without fabricating experience.
            </Typography>
            <Button variant="contained" onClick={handleRewrite} startIcon={<AutoAwesomeIcon />}>
              Rewrite Now
            </Button>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button variant="text" onClick={handleClose}>Cancel</Button>
        {result && (
          <Button variant="contained" onClick={handleApply}>
            Apply Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
