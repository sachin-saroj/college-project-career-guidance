import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useBookmarks, useToggleBookmark } from '../../modules/resources/hooks/useResources';
import { ResourceType } from '../../modules/resources/types/resource.types';

interface BookmarkButtonProps {
  resourceId: string;
  type: ResourceType;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ resourceId, type }) => {
  const { data: bookmarks } = useBookmarks();
  const { mutate: toggleBookmark } = useToggleBookmark();

  const isBookmarked = bookmarks?.data?.includes(resourceId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark({ id: resourceId, type, action: isBookmarked ? 'remove' : 'add' });
  };

  return (
    <Tooltip title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}>
      <IconButton 
        onClick={handleClick} 
        color={isBookmarked ? "primary" : "default"}
        size="small"
        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.100' } }}
      >
        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};
