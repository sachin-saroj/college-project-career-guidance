import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Resume } from '../../modules/resume/types/resume.types';

interface ResumePreviewProps {
  data: Partial<Resume>;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '800px', 
        minHeight: '1131px', // A4 aspect ratio 1:1.414 (800 x 1131)
        bgcolor: 'white', 
        p: 6, 
        boxShadow: 3, 
        mx: 'auto',
        color: '#333',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#111', textTransform: 'uppercase', letterSpacing: 1 }}>
          {data.personalInfo?.fullName || 'Your Name'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>
          {[
            data.personalInfo?.email,
            data.personalInfo?.phone,
            data.personalInfo?.location,
            data.personalInfo?.linkedin
          ].filter(Boolean).join('  |  ')}
        </Typography>
      </Box>

      {/* Objective */}
      {data.careerObjective && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2">{data.careerObjective}</Typography>
        </Box>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '1px solid #ccc', mb: 1.5, pb: 0.5, textTransform: 'uppercase', fontSize: '1rem' }}>
            Experience
          </Typography>
          {data.experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="subtitle2" fontWeight="bold">{exp.role}</Typography>
                <Typography variant="caption" fontWeight="medium">
                  {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : '')}
                </Typography>
              </Box>
              <Typography variant="body2" fontStyle="italic" sx={{ mb: 0.5 }}>{exp.company}</Typography>
              <Box component="ul" sx={{ mt: 0, pl: 2, mb: 0 }}>
                {exp.description?.map((desc, i) => (
                  <Typography component="li" variant="body2" key={i} sx={{ mb: 0.25 }}>{desc}</Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '1px solid #ccc', mb: 1.5, pb: 0.5, textTransform: 'uppercase', fontSize: '1rem' }}>
            Education
          </Typography>
          {data.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="subtitle2" fontWeight="bold">{edu.institution}</Typography>
                <Typography variant="caption" fontWeight="medium">
                  {edu.startYear} - {edu.endYear || 'Present'}
                </Typography>
              </Box>
              <Typography variant="body2">{edu.degree} {edu.percentage ? `(${edu.percentage}%)` : ''}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '1px solid #ccc', mb: 1.5, pb: 0.5, textTransform: 'uppercase', fontSize: '1rem' }}>
            Projects
          </Typography>
          {data.projects.map((proj, idx) => (
            <Box key={idx} sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {proj.title} {proj.url && <Typography component="span" variant="caption" sx={{ fontWeight: 'normal', color: 'primary.main' }}>({proj.url})</Typography>}
              </Typography>
              {proj.techStack && proj.techStack.length > 0 && (
                <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', mb: 0.5 }}>
                  {proj.techStack.join(', ')}
                </Typography>
              )}
              <Typography variant="body2">{proj.description}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '1px solid #ccc', mb: 1.5, pb: 0.5, textTransform: 'uppercase', fontSize: '1rem' }}>
            Skills
          </Typography>
          <Typography variant="body2">{data.skills.join(' • ')}</Typography>
        </Box>
      )}
    </Box>
  );
};
