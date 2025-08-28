import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Member } from '../types';
import { memberAPI } from '../services/api';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Partial<Member> | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await memberAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = () => {
    setSelectedMember({});
    setOpenDialog(true);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        setLoading(true);
        await memberAPI.delete(id);
        await fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        setError('Failed to delete member. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (selectedMember?.id) {
        await memberAPI.update(selectedMember.id, selectedMember);
      } else {
        await memberAPI.create(selectedMember as Omit<Member, 'id'>);
      }
      setOpenDialog(false);
      await fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      setError('Failed to save member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
   /*  { field: 'membershipNumber', headerName: 'Membership Number', width: 150 },
    { field: 'joinDate', headerName: 'Join Date', width: 130 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params: GridRenderCellParams<Member>) => (
        <span style={{ 
          color: params.value === 'ACTIVE' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {params.value}
        </span>
      ),
    }, */
    { field: 'outstandingDept', headerName: 'Outstanding Debt', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridRenderCellParams<Member>) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}
            startIcon={<EditIcon />}
            disabled={loading}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            startIcon={<DeleteIcon />}
            disabled={loading}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  if (loading && members.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Members</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={loading}
        >
          Add Member
        </Button>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={members}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedMember?.id ? 'Edit Member' : 'Add New Member'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Name"
              value={selectedMember?.name || ''}
              onChange={(e) => setSelectedMember(prev => ({ ...prev, name: e.target.value }))}
              disabled={loading}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={selectedMember?.email || ''}
              onChange={(e) => setSelectedMember(prev => ({ ...prev, email: e.target.value }))}
              disabled={loading}
              fullWidth
              required
            />
            <TextField
              label="Membership Number"
              value={selectedMember?.membershipNumber || ''}
              onChange={(e) => setSelectedMember(prev => ({ ...prev, membershipNumber: e.target.value }))}
              disabled={loading}
              fullWidth
              required
            />
            <TextField
              label="Join Date"
              type="date"
              value={selectedMember?.joinDate || ''}
              onChange={(e) => setSelectedMember(prev => ({ ...prev, joinDate: e.target.value }))}
              disabled={loading}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Status"
              value={selectedMember?.status || 'ACTIVE'}
              onChange={(e) => setSelectedMember(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
              disabled={loading}
              fullWidth
              required
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>
            <TextField
              label="Outstanding Debt"
              type="number"
              value={selectedMember?.outstandingDept || 0}
              onChange={(e) => setSelectedMember(prev => ({ ...prev, outstandingDept: Number(e.target.value) }))}
              disabled={loading}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={loading || !selectedMember?.name || !selectedMember?.email || !selectedMember?.membershipNumber}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 