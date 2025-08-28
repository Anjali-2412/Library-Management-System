import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  LibraryBooks as BookIcon,
  People as MemberIcon,
  SwapHoriz as BorrowIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { bookAPI, memberAPI, borrowAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalBorrows: 0,
    loading: true,
    error: null as string | null,
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      const [books, members, borrows] = await Promise.all([
        bookAPI.getAll(),
        memberAPI.getAll(),
        borrowAPI.getAll(),
      ]);

      setStats({
        totalBooks: books.data.length,
        totalMembers: members.data.length,
        totalBorrows: borrows.data.length,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      const errorMessage = error.response?.status === 401
        ? 'Session expired. Please log in again.'
        : 'Failed to load dashboard statistics. Please try again.';
      setStats(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
    </Paper>
  );

  if (stats.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (stats.error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh" gap={2}>
        <Typography color="error">{stats.error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchStats}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={<BookIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<MemberIcon sx={{ fontSize: 40, color: 'secondary.main' }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Borrows"
            value={stats.totalBorrows}
            icon={<BorrowIcon sx={{ fontSize: 40, color: 'success.main' }} />}
          />
        </Grid>
      </Grid>
    </Box>
  );
} 