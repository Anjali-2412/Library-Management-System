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
import { Add as AddIcon, LibraryBooks as ReturnIcon } from '@mui/icons-material';
import type { BorrowRecord, Book, Member } from '../types';
import { borrowAPI, bookAPI, memberAPI } from '../services/api';

export default function Borrows() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<Partial<BorrowRecord> | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data...');
      const [borrowsRes, booksRes, membersRes] = await Promise.all([
        borrowAPI.getAll(),
        bookAPI.getAll(),
        memberAPI.getAll(),
      ]);
      console.log('Borrows data:', borrowsRes.data);
      console.log('Books data:', booksRes.data);
      console.log('Members data:', membersRes.data);
      setBorrows(borrowsRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedBorrow({});
    setOpenDialog(true);
  };

  const handleReturn = async (id: number) => {
    try {
      setLoading(true);
      await borrowAPI.returnBook(id);
      await fetchData();
    } catch (error) {
      console.error('Error returning book:', error);
      setError('Failed to return book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedBorrow?.id && selectedBorrow?.book && selectedBorrow?.member) {
        setLoading(true);
        const borrowRequest = {
          memberId: selectedBorrow.member.id,
          bookId: selectedBorrow.book.id
        };
        console.log('Creating borrow with:', borrowRequest);
        await borrowAPI.create(borrowRequest);
        setOpenDialog(false);
        await fetchData();
      }
    } catch (error) {
      console.error('Error saving borrow record:', error);
      setError('Failed to save borrow record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'book',
      headerName: 'Book',
      flex: 1,
      valueGetter: (value, row: BorrowRecord) => row.book?.title || 'Unknown Book'
    },
    {
      field: 'member',
      headerName: 'Member',
      flex: 1,
      valueGetter: (value, row: BorrowRecord) => row.member?.name || 'Unknown Member'
    },
    { 
      field: 'issueDate', 
      headerName: 'Issue Date', 
      width: 130,
      valueGetter: (value, row: BorrowRecord) => {
        const date = row.issueDate;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      }
    },
    { 
      field: 'returnDate', 
      headerName: 'Return Date', 
      width: 130,
      valueGetter: (value, row: BorrowRecord) => {
        const date = row.returnDate;
        return date ? new Date(date).toLocaleDateString() : 'Not Returned';
      }
    },
    { 
      field: 'fine', 
      headerName: 'Fine', 
      width: 100,
      valueGetter: (value, row: BorrowRecord) => row.fine || 0
    },
    { 
      field: 'returned', 
      headerName: 'Status', 
      width: 100,
      valueGetter: (value, row: BorrowRecord) => row.returned ? 'Returned' : 'Borrowed'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: GridRenderCellParams<BorrowRecord>) => (
        <Box>
          {!params.row.returned && (
            <Button
              size="small"
              color="primary"
              onClick={() => handleReturn(params.row.id)}
              startIcon={<ReturnIcon />}
              disabled={loading}
            >
              Return
            </Button>
          )}
        </Box>
      ),
    },
  ];

  if (loading) {
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
        <Typography variant="h4">Borrows</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={loading}
        >
          Add Borrow
        </Button>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={borrows}
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
          Add New Borrow
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              select
              label="Book"
              value={selectedBorrow?.book?.id || ''}
              onChange={(e) => {
                const book = books.find(b => b.id === Number(e.target.value));
                setSelectedBorrow(prev => ({
                  ...prev,
                  book,
                }));
              }}
              disabled={loading}
              fullWidth
            >
              {books.filter(book => book.availability).map((book) => (
                <MenuItem key={book.id} value={book.id}>
                  {book.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Member"
              value={selectedBorrow?.member?.id || ''}
              onChange={(e) => {
                const member = members.find(m => m.id === Number(e.target.value));
                setSelectedBorrow(prev => ({
                  ...prev,
                  member,
                }));
              }}
              disabled={loading}
              fullWidth
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={loading || !selectedBorrow?.book || !selectedBorrow?.member}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 