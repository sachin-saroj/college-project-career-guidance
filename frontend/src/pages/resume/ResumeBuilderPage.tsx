import React, { useState } from 'react';
import { Box, Typography, CircularProgress, IconButton, Paper, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useResume, useUpdateResume } from '../../modules/resume/hooks/useResume';
import { resumeApi } from '../../modules/resume/api/resume.api';
import { ResumeEditor } from '../../components/resume/ResumeEditor';
import { ResumePreview } from '../../components/resume/ResumePreview';
import { ATSScoreCard } from '../../components/resume/ATSScoreCard';
import { Resume } from '../../modules/resume/types/resume.types';

export const ResumeBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: resumeRes, isLoading, error } = useResume(id || '');
  const { mutate: updateResume } = useUpdateResume();
  const [liveData, setLiveData] = useState<Partial<Resume>>({});
  const [activeTab, setActiveTab] = useState<'preview' | 'ats'>('preview');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !resumeRes) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load resume.</Typography>
      </Box>
    );
  }

  const initialData = resumeRes.data;

  const handleEditorChange = (newData: Partial<Resume>) => {
    setLiveData(newData);
    // Auto-save logic triggers in the background
    if (id) {
      updateResume({ id, data: newData });
    }
  };

  const currentPreviewData = { ...initialData, ...liveData };

  const handleDownloadPdf = () => {
    if (id) {
      window.open(resumeApi.exportPdfUrl(id), '_blank');
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* LEFT: Editor */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.default', borderRight: '1px solid', borderColor: 'divider' }}>
        <ResumeEditor initialData={initialData} onChange={handleEditorChange} />
      </Box>

      {/* RIGHT: Live Preview & Tools */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'grey.100', overflow: 'hidden' }}>
        
        {/* Right Panel Header */}
        <Paper square elevation={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} indicatorColor="primary" textColor="primary">
            <Tab icon={<VisibilityIcon sx={{ mr: 1 }} />} iconPosition="start" label="Live Preview" value="preview" sx={{ minHeight: 64 }} />
            <Tab icon={<AnalyticsIcon sx={{ mr: 1 }} />} iconPosition="start" label="ATS Analysis" value="ats" sx={{ minHeight: 64 }} />
          </Tabs>
          
          <IconButton color="primary" onClick={handleDownloadPdf} title="Download PDF">
            <DownloadIcon />
          </IconButton>
        </Paper>

        {/* Right Panel Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {activeTab === 'preview' ? (
            <Box sx={{ transform: 'scale(0.85)', transformOrigin: 'top center', transition: 'all 0.3s' }}>
              <ResumePreview data={currentPreviewData} />
            </Box>
          ) : (
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <ATSScoreCard resumeId={id!} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
