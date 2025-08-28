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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Book } from '../types';
import { bookAPI } from '../services/api';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = () => {
    setSelectedBook({});
    setOpenDialog(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.delete(id);
        await fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (selectedBook?.id) {
        await bookAPI.update(selectedBook.title, selectedBook);
      } else {
        await bookAPI.create(selectedBook as Omit<Book, 'id'>);
      }
      setOpenDialog(false);
      await fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const columns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'author', headerName: 'Author', flex: 1 },
        { field: 'isbn', headerName: 'ISBN', flex: 1, minWidth: 120 },
        { field: 'quantity', headerName: 'Quantity', flex: 0.7 },
        {
          field: 'availability',
          headerName: 'Available',
          flex: 0.7
        },
        { field: 'publisher', headerName: 'Publisher', flex: 1 },
        { field: 'publicationDate', headerName: 'Publication Date', flex: 1, minWidth: 150 },
        { field: 'languageCode', headerName: 'Language', flex: 0.7 },
        { field: 'price', headerName: 'Price', flex: 0.7 },
        { field: 'rentingCost', headerName: 'Renting Cost', flex: 0.7, minWidth: 120 },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 150,
    /* { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'author', headerName: 'Author', flex: 1 },
    { field: 'isbn', headerName: 'ISBN', width: 130 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { 
      field: 'availability', 
      headerName: 'Available', 
      width: 100,
      renderCell: (params: GridRenderCellParams<Book>) => (
        <span>{params.value ? 'Yes' : 'No'}</span>
      ),
    },
    { field: 'publisher', headerName: 'Publisher', width: 130 },
    { field: 'publicationDate', headerName: 'Publication Date', width: 130 },
    { field: 'languageCode', headerName: 'Language', width: 100 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'rentingCost', headerName: 'Renting Cost', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120, */
      renderCell: (params: GridRenderCellParams<Book>) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Books</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Book
        </Button>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={books}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedBook?.id ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Title"
              value={selectedBook?.title || ''}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, title: e.target.value })
              }
            />
            <TextField
              label="Author"
              value={selectedBook?.author || ''}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, author: e.target.value })
              }
            />
            <TextField
              label="ISBN"
              value={selectedBook?.isbn || ''}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, isbn: e.target.value })
              }
            />
            <TextField
              label="Quantity"
              type="number"
              value={selectedBook?.quantity || ''}
              onChange={(e) =>
                setSelectedBook({
                  ...selectedBook,
                  quantity: parseInt(e.target.value),
                })
              }
            />
            <TextField
              label="Publisher"
              value={selectedBook?.publisher || ''}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, publisher: e.target.value })
              }
            />
            <TextField
              label="Publication Date"
              type="date"
              value={selectedBook?.publicationDate || ''}
              onChange={(e) =>
                setSelectedBook({
                  ...selectedBook,
                  publicationDate: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Language"
              value={selectedBook?.languageCode || ''}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, languageCode: e.target.value })
              }
            />
            <TextField
              label="Price"
              type="number"
              value={selectedBook?.price || ''}
              onChange={(e) =>
                setSelectedBook({
                  ...selectedBook,
                  price: parseInt(e.target.value),
                })
              }
            />
            <TextField
              label="Renting Cost"
              type="number"
              value={selectedBook?.rentingCost || ''}
              onChange={(e) =>
                setSelectedBook({
                  ...selectedBook,
                  rentingCost: parseInt(e.target.value),
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 