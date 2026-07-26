import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Select, MenuItem, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUsers, useUpdateUserStatus } from '../../../modules/admin/hooks/useAdmin';
import { DataTable, Column } from '../../../components/admin/shared/DataTable';
import { StatusChip } from '../../../components/admin/shared/StatusChip';
import { AdminUser } from '../../../modules/admin/types/admin.types';

export const UserManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  
  const { data: usersRes, isLoading } = useUsers(page, limit, search);
  const { mutate: updateStatus } = useUpdateUserStatus();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on search
  };

  const columns: Column<AdminUser>[] = [
    { id: 'email', label: 'Email', minWidth: 200 },
    { 
      id: 'role', 
      label: 'Role', 
      format: (val: string) => <StatusChip status={val} /> 
    },
    { 
      id: 'createdAt', 
      label: 'Registered On', 
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
      format: (_, row: AdminUser) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title="View/Edit Details">
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.status === 'ACTIVE' ? (
            <Tooltip title="Suspend User">
              <IconButton size="small" color="error" onClick={() => updateStatus({ id: row._id, status: 'SUSPENDED' })}>
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activate User">
              <IconButton size="small" color="success" onClick={() => updateStatus({ id: row._id, status: 'ACTIVE' })}>
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>User Management</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField 
          placeholder="Search by email..." 
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

      <DataTable<AdminUser>
        columns={columns}
        data={usersRes?.data.data || []}
        total={usersRes?.data.total || 0}
        page={page}
        rowsPerPage={limit}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        isLoading={isLoading}
      />
    </Box>
  );
};
