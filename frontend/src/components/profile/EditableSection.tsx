import React, { useState } from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Card } from '../ui/Card';

interface EditableSectionProps {
  title: string;
  children: React.ReactNode;
  isEditing?: boolean;
  onEditToggle?: (isEditing: boolean) => void;
  hideEditButton?: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = ({ 
  title, 
  children, 
  isEditing: controlledIsEditing,
  onEditToggle,
  hideEditButton = false
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  
  // Use controlled state if provided, otherwise fallback to internal state
  const isEditing = controlledIsEditing !== undefined ? controlledIsEditing : internalIsEditing;

  const handleToggle = () => {
    const newState = !isEditing;
    setInternalIsEditing(newState);
    if (onEditToggle) {
      onEditToggle(newState);
    }
  };

  return (
    <Card 
      title={title} 
      action={
        !hideEditButton && (
          <IconButton onClick={handleToggle} color={isEditing ? "error" : "primary"} size="small">
            {isEditing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        )
      }
      sx={{ mb: 3 }}
    >
      <Divider sx={{ mb: 3, mt: 1 }} />
      <Box>
        {children}
      </Box>
    </Card>
  );
};
