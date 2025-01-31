import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Skeleton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuard from '../components/AuthGuard';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', dob: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/data?id=${id}`);
      fetchData();
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Failed to delete item', error);
      toast.error('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setNewItem({ name: '', dob: '' });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        // Update existing item
        await axios.put(`/api/data?id=${editItem.id}`, editItem);
        toast.success('Item updated successfully');
      } else {
        // Add new item
        await axios.post('/api/data', newItem);
        toast.success('Item added successfully');
      }
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save item', error);
      toast.error('Failed to save item');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
    setNewItem({ name: '', dob: '' });
  };

  const calculateAge = (dob) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  return (
    <AuthGuard>
      <Paper sx={{ padding: 3, margin: '20px auto', width: '80%' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{ marginBottom: 2 }}
        >
          Add New Item
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Age</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date of Birth</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Skeleton Loader for Loading State
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" width={100} height={30} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                data.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{calculateAge(item.dob)}</TableCell>
                    <TableCell>{item.dob}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(item)}
                        sx={{ marginRight: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog for Add/Edit Item */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={editItem ? editItem.name : newItem.name}
            onChange={(e) =>
              editItem
                ? setEditItem({ ...editItem, name: e.target.value })
                : setNewItem({ ...newItem, name: e.target.value })
            }
          />
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={editItem ? editItem.dob : newItem.dob}
            onChange={(e) =>
              editItem
                ? setEditItem({ ...editItem, dob: e.target.value })
                : setNewItem({ ...newItem, dob: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthGuard>
  );
};

export default Dashboard;
