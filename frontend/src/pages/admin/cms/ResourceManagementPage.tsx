import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useResources, useUpdateResourceStatus } from '../../../modules/admin/hooks/useAdmin';
import { DataTable, Column } from '../../../components/admin/shared/DataTable';
import { StatusChip } from '../../../components/admin/shared/StatusChip';
import { AdminResource } from '../../../modules/admin/types/admin.types';

export const ResourceManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  
  const { data: resRes, isLoading } = useResources(page, limit, search);
  const { mutate: updateStatus } = useUpdateResourceStatus();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const columns: Column<AdminResource>[] = [
    { id: 'title', label: 'Resource Title', minWidth: 250 },
    { id: 'type', label: 'Type' },
    { id: 'views', label: 'Views', align: 'right', format: (val: number) => val.toLocaleString() },
    { 
      id: 'createdAt', 
      label: 'Created', 
      format: (val: string) => new Date(val).toLocaleDateString() 
    },
    { 
      id: 'status', 
      label: 'Status', 
      format: (val: string) => <StatusChip status={val} /> 
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      format: (_, row: AdminResource) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title="Edit Resource">
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.status === 'DRAFT' && (
            <Tooltip title="Publish">
              <IconButton size="small" color="success" onClick={() => updateStatus({ id: row._id, status: 'PUBLISHED' })}>
                <PublishIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {row.status === 'PUBLISHED' && (
            <Tooltip title="Archive">
              <IconButton size="small" color="warning" onClick={() => updateStatus({ id: row._id, status: 'ARCHIVED' })}>
                <ArchiveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>CMS & Resources</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField 
          placeholder="Search resources..." 
          size="small" 
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300, bgcolor: 'background.paper' }}
        />
      </Box>

      <DataTable<AdminResource>
        columns={columns}
        data={resRes?.data.data || []}
        total={resRes?.data.total || 0}
        page={page}
        rowsPerPage={limit}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        isLoading={isLoading}
      />
    </Box>
  );
};
