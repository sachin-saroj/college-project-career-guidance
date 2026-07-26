import React, { useRef, useState } from 'react';
import { Box, Avatar, Typography, IconButton, CircularProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useUploadAvatar } from '../../modules/profile/hooks/useProfile';
import toast from 'react-hot-toast';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  name: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatarUrl, name }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }

    // Set local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    uploadAvatar(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: 'fit-content' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={preview || currentAvatarUrl}
          alt={name}
          sx={{ width: 120, height: 120, fontSize: 48, bgcolor: 'primary.main', boxShadow: 2 }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
        
        {isPending && (
          <CircularProgress
            size={120}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              color: 'secondary.main',
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isPending}
        />
        
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          sx={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.default' },
          }}
        >
          <PhotoCameraIcon />
        </IconButton>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Allowed *.jpeg, *.jpg, *.png, *.webp
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Max size of 5MB
      </Typography>
    </Box>
  );
};
