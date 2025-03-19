import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface DealFormData {
  make: string;
  model: string;
  year: number;
  lease_price: number;
  term: number;
  down_payment: number;
  mileage: number;
  msrp: number;
  savings?: number;
  tags?: string;
  description?: string;
}

interface DemoFormData {
  make: string;
  model: string;
  year: number;
  lease_price: number;
  term: number;
  down_payment: number;
  mileage: number;
  msrp: number;
  savings?: number;
  tags?: string;
  description?: string;
}

// Add interfaces for the deal and demo data from API
interface DealData {
  id: number;
  make: string;
  model: string;
  year: number;
  image_url: string;
  lease_price: number;
  term: number;
  down_payment: number;
  mileage: number;
  msrp: number;
  savings?: number;
  tags?: string[] | null;
  description?: string;
}

interface DemoData {
  id: number;
  make: string;
  model: string;
  year: number;
  image_url: string;
  lease_price: number;
  term: number;
  down_payment: number;
  mileage: number;
  msrp: number;
  savings?: number;
  tags?: string[] | null;
  description?: string;
}

const initialDealFormData: DealFormData = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  lease_price: 0,
  term: 0,
  down_payment: 0,
  mileage: 0,
  msrp: 0,
};

const initialDemoFormData: DemoFormData = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  lease_price: 0,
  term: 0,
  down_payment: 0,
  mileage: 0,
  msrp: 0,
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [dealFormData, setDealFormData] = useState<DealFormData>(initialDealFormData);
  const [demoFormData, setDemoFormData] = useState<DemoFormData>(initialDemoFormData);
  const [dealImageFile, setDealImageFile] = useState<File | null>(null);
  const [demoImageFile, setDemoImageFile] = useState<File | null>(null);
  const [dealImagePreview, setDealImagePreview] = useState<string | null>(null);
  const [demoImagePreview, setDemoImagePreview] = useState<string | null>(null);
  const [dealSubmitting, setDealSubmitting] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Use proper types for the deals and demos arrays
  const [deals, setDeals] = useState<DealData[]>([]);
  const [demos, setDemos] = useState<DemoData[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [loadingDemos, setLoadingDemos] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, type: 'deal' | 'demo'} | null>(null);
  
  // New state for edit functionality
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<{id: number, type: 'deal' | 'demo'} | null>(null);
  const [editFormData, setEditFormData] = useState<DealFormData | DemoFormData | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Add Deal/Demo dialog state
  const [addDealDialogOpen, setAddDealDialogOpen] = useState(false);
  const [addDemoDialogOpen, setAddDemoDialogOpen] = useState(false);

  // Add state for edit image
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Fetch deals and demos when the component mounts or when the tab changes to Manage Data
  useEffect(() => {
    if (activeTab === 0) {
      fetchDeals();
      fetchDemos();
    }
  }, [activeTab]);

  const fetchDeals = async () => {
    try {
      setLoadingDeals(true);
      const response = await api.get('/deals/');
      setDeals(response.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      showSnackbar('Failed to fetch deals data', 'error');
    } finally {
      setLoadingDeals(false);
    }
  };

  const fetchDemos = async () => {
    try {
      setLoadingDemos(true);
      const response = await api.get('/demos/');
      setDemos(response.data);
    } catch (error) {
      console.error('Error fetching demos:', error);
      showSnackbar('Failed to fetch demos data', 'error');
    } finally {
      setLoadingDemos(false);
    }
  };

  const handleDeleteClick = (id: number, type: 'deal' | 'demo') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      const { id, type } = itemToDelete;
      const endpoint = type === 'deal' ? `/deals/${id}` : `/demos/${id}`;
      
      await api.delete(endpoint);
      
      // Refresh the data
      if (type === 'deal') {
        fetchDeals();
      } else {
        fetchDemos();
      }
      
      showSnackbar(`${type === 'deal' ? 'Deal' : 'Demo'} deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showSnackbar('Failed to delete item', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleLogout = () => {
    // Navigate back to home, the protected route will handle showing the login screen next time
    navigate('/');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDealChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDealFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'lease_price' || name === 'term' || 
              name === 'down_payment' || name === 'mileage' || name === 'msrp' || 
              name === 'savings' 
                ? Number(value) 
                : value
    }));
  };

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDemoFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'lease_price' || name === 'term' || 
              name === 'down_payment' || name === 'mileage' || name === 'msrp' || 
              name === 'savings' 
                ? Number(value) 
                : value
    }));
  };

  const handleDealImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDealImageFile(file);
      setDealImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDemoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDemoImageFile(file);
      setDemoImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddDealDialog = () => {
    // Reset form data before opening
    setDealFormData(initialDealFormData);
    setDealImageFile(null);
    setDealImagePreview(null);
    setAddDealDialogOpen(true);
  };

  const handleCloseAddDealDialog = () => {
    setAddDealDialogOpen(false);
  };

  const handleOpenAddDemoDialog = () => {
    // Reset form data before opening
    setDemoFormData(initialDemoFormData);
    setDemoImageFile(null);
    setDemoImagePreview(null);
    setAddDemoDialogOpen(true);
  };

  const handleCloseAddDemoDialog = () => {
    setAddDemoDialogOpen(false);
  };

  const handleDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealImageFile) {
      showSnackbar('Please select an image for the deal', 'error');
      return;
    }

    try {
      setDealSubmitting(true);
      
      // First, upload the image
      const formData = new FormData();
      formData.append('file', dealImageFile);
      
      const imageResponse = await api.post('/upload/deal-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      const imageUrl = imageResponse.data.image_url;
      
      // Then, create the deal with the image URL as part of the JSON payload
      const dealDataWithImage = {
        ...dealFormData,
        image_url: imageUrl
      };
      
      await api.post('/deals/', dealDataWithImage);
      
      // Reset form after successful submission
      setDealFormData(initialDealFormData);
      setDealImageFile(null);
      setDealImagePreview(null);
      setAddDealDialogOpen(false);
      showSnackbar('Deal created successfully!', 'success');
      
      // Refresh deals data
      fetchDeals();
    } catch (error) {
      console.error('Error creating deal:', error);
      showSnackbar('Failed to create deal. Please try again.', 'error');
    } finally {
      setDealSubmitting(false);
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoImageFile) {
      showSnackbar('Please select an image for the demo', 'error');
      return;
    }

    try {
      setDemoSubmitting(true);
      
      // First, upload the image
      const formData = new FormData();
      formData.append('file', demoImageFile);
      
      const imageResponse = await api.post('/upload/demo-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      const imageUrl = imageResponse.data.image_url;
      
      // Then, create the demo with the image URL as part of the JSON payload
      const demoDataWithImage = {
        ...demoFormData,
        image_url: imageUrl
      };
      
      await api.post('/demos/', demoDataWithImage);
      
      // Reset form after successful submission
      setDemoFormData(initialDemoFormData);
      setDemoImageFile(null);
      setDemoImagePreview(null);
      setAddDemoDialogOpen(false);
      showSnackbar('Demo created successfully!', 'success');
      
      // Refresh demos data
      fetchDemos();
    } catch (error) {
      console.error('Error creating demo:', error);
      showSnackbar('Failed to create demo. Please try again.', 'error');
    } finally {
      setDemoSubmitting(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (id: number, type: 'deal' | 'demo') => {
    // Find the item to edit
    const item = type === 'deal' 
      ? deals.find(deal => deal.id === id)
      : demos.find(demo => demo.id === id);
    
    if (!item) return;
    
    // Prepare the string version of tags
    let tagsString = '';
    if (item.tags && Array.isArray(item.tags)) {
      tagsString = item.tags.join(',');
    } else if (typeof item.tags === 'string') {
      tagsString = item.tags;
    }
    
    // Create form data with the right types
    const formData: DealFormData | DemoFormData = {
      make: item.make,
      model: item.model,
      year: item.year,
      lease_price: item.lease_price,
      term: item.term,
      down_payment: item.down_payment,
      mileage: item.mileage,
      msrp: item.msrp,
      savings: item.savings,
      tags: tagsString,
      description: item.description
    };
    
    setItemToEdit({ id, type });
    setEditFormData(formData);
    setCurrentImageUrl(item.image_url);
    setEditImagePreview(null);
    setEditImageFile(null);
    setEditDialogOpen(true);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setItemToEdit(null);
    setEditFormData(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setCurrentImageUrl(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editFormData) return;
    
    const { name, value } = e.target;
    setEditFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'year' || name === 'lease_price' || name === 'term' || 
                name === 'down_payment' || name === 'mileage' || name === 'msrp' || 
                name === 'savings' 
                  ? Number(value) 
                  : value
      };
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async () => {
    if (!itemToEdit || !editFormData) return;
    
    try {
      setEditSubmitting(true);
      const { id, type } = itemToEdit;
      
      let imageUrl = currentImageUrl;
      
      // If a new image was selected, upload it first
      if (editImageFile) {
        const formData = new FormData();
        formData.append('file', editImageFile);
        
        const uploadEndpoint = type === 'deal' 
          ? '/upload/deal-image/' 
          : '/upload/demo-image/';
        
        const imageResponse = await api.post(uploadEndpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        
        imageUrl = imageResponse.data.image_url;
      }
      
      // Create update payload with the image URL (either new or existing)
      const updateData = {
        ...editFormData,
        image_url: imageUrl
      };
      
      const endpoint = type === 'deal' ? `/deals/${id}` : `/demos/${id}`;
      await api.put(endpoint, updateData);
      
      // Refresh the data
      if (type === 'deal') {
        fetchDeals();
      } else {
        fetchDemos();
      }
      
      showSnackbar(`${type === 'deal' ? 'Deal' : 'Demo'} updated successfully`, 'success');
      setEditDialogOpen(false);
      setItemToEdit(null);
      setEditFormData(null);
      setEditImageFile(null);
      setEditImagePreview(null);
      setCurrentImageUrl(null);
    } catch (error) {
      console.error('Error updating item:', error);
      showSnackbar('Failed to update item', 'error');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={handleLogout}
          sx={{padding:1, fontSize:".75rem", backgroundColor:"red", border:"none"}}
        >
          Logout
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered 
          sx={{ mb: 3 }}
        >
          <Tab label="Manage Data" />
        </Tabs>
        
        {/* Manage Data Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {/* Manage Deals & Demos */}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                Current Deals
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleOpenAddDealDialog}
                sx={{padding:1, fontSize:".75rem", backgroundColor:"green", border:"none"}}
              >
                Add Deal
              </Button>
            </Box>
            
            {loadingDeals ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : deals.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No deals found.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Make</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Term</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>{deal.id}</TableCell>
                        <TableCell>{deal.make}</TableCell>
                        <TableCell>{deal.model}</TableCell>
                        <TableCell>{deal.year}</TableCell>
                        <TableCell>${deal.lease_price}/mo</TableCell>
                        <TableCell>{deal.term} mo</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditClick(deal.id, 'deal')}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(deal.id, 'deal')}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 4 }}>
              <Typography variant="h5">
                Current Demos
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleOpenAddDemoDialog}
                sx={{padding:1, fontSize:".75rem", backgroundColor:"green", border:"none"}}
              >
                Add Demo
              </Button>
            </Box>
            
            {loadingDemos ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : demos.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No demos found.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Make</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Term</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {demos.map((demo) => (
                      <TableRow key={demo.id}>
                        <TableCell>{demo.id}</TableCell>
                        <TableCell>{demo.make}</TableCell>
                        <TableCell>{demo.model}</TableCell>
                        <TableCell>{demo.year}</TableCell>
                        <TableCell>${demo.lease_price}/mo</TableCell>
                        <TableCell>{demo.term} mo</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditClick(demo.id, 'demo')}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(demo.id, 'demo')}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={fetchDeals}
                disabled={loadingDeals}
              >
                Refresh Deals
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={fetchDemos}
                disabled={loadingDemos}
              >
                Refresh Demos
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Add Deal Dialog */}
      <Dialog 
        open={addDealDialogOpen} 
        onClose={handleCloseAddDealDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Deal</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleDealSubmit} noValidate>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Make"
                  name="make"
                  value={dealFormData.make}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Model"
                  name="model"
                  value={dealFormData.model}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={dealFormData.year}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Lease Price"
                  name="lease_price"
                  type="number"
                  value={dealFormData.lease_price}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Term (months)"
                  name="term"
                  type="number"
                  value={dealFormData.term}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Down Payment"
                  name="down_payment"
                  type="number"
                  value={dealFormData.down_payment}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Mileage"
                  name="mileage"
                  type="number"
                  value={dealFormData.mileage}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="MSRP"
                  name="msrp"
                  type="number"
                  value={dealFormData.msrp}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Savings"
                  name="savings"
                  type="number"
                  value={dealFormData.savings || ''}
                  onChange={handleDealChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  name="tags"
                  value={dealFormData.tags || ''}
                  onChange={handleDealChange}
                  helperText="e.g. Luxury,SUV,Featured"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={dealFormData.description || ''}
                  onChange={handleDealChange}
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Upload Deal Image
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="deal-image-upload"
                  type="file"
                  onChange={handleDealImageChange}
                />{dealImagePreview && (
                  <Box sx={{ mt: 2, maxWidth: 300 }}>
                    <img src={dealImagePreview} alt="Deal preview" style={{ width: '100%' }} />
                  </Box>
                )}
                <label htmlFor="deal-image-upload">
                  <Button variant="contained" component="span" sx={{ mr: 2, backgroundColor:"grey", fontSize:".75rem", border:"none" }}>
                    Choose Image
                  </Button>
                </label>
                
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDealDialog} sx={{backgroundColor:"red", border:"none"}}>
            Cancel
          </Button>
          <Button
            onClick={handleDealSubmit}
            color="primary"
            variant="contained"
            disabled={dealSubmitting}
          >
            {dealSubmitting ? <CircularProgress size={24} /> : 'Add Deal'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Demo Dialog */}
      <Dialog 
        open={addDemoDialogOpen} 
        onClose={handleCloseAddDemoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Demo</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleDemoSubmit} noValidate>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Make"
                  name="make"
                  value={demoFormData.make}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Model"
                  name="model"
                  value={demoFormData.model}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={demoFormData.year}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Lease Price"
                  name="lease_price"
                  type="number"
                  value={demoFormData.lease_price}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Term (months)"
                  name="term"
                  type="number"
                  value={demoFormData.term}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Down Payment"
                  name="down_payment"
                  type="number"
                  value={demoFormData.down_payment}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Mileage"
                  name="mileage"
                  type="number"
                  value={demoFormData.mileage}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="MSRP"
                  name="msrp"
                  type="number"
                  value={demoFormData.msrp}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Savings"
                  name="savings"
                  type="number"
                  value={demoFormData.savings || ''}
                  onChange={handleDemoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  name="tags"
                  value={demoFormData.tags || ''}
                  onChange={handleDemoChange}
                  helperText="e.g. Electric,SUV,Featured"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={demoFormData.description || ''}
                  onChange={handleDemoChange}
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Upload Demo Image
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="demo-image-upload"
                  type="file"
                  onChange={handleDemoImageChange}
                />
                <label htmlFor="demo-image-upload">
                  <Button variant="contained" component="span" sx={{ mr: 2 }}>
                    Choose Image
                  </Button>
                </label>
                {demoImagePreview && (
                  <Box sx={{ mt: 2, maxWidth: 300 }}>
                    <img src={demoImagePreview} alt="Demo preview" style={{ width: '100%' }} />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDemoDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDemoSubmit}
            color="primary"
            variant="contained"
            disabled={demoSubmitting}
          >
            {demoSubmitting ? <CircularProgress size={24} /> : 'Add Demo'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditCancel}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Edit {itemToEdit?.type === 'deal' ? 'Deal' : 'Demo'}
        </DialogTitle>
        <DialogContent>
          {editFormData && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Make"
                  name="make"
                  value={editFormData.make}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Model"
                  name="model"
                  value={editFormData.model}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={editFormData.year}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Lease Price"
                  name="lease_price"
                  type="number"
                  value={editFormData.lease_price}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Term (months)"
                  name="term"
                  type="number"
                  value={editFormData.term}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Down Payment"
                  name="down_payment"
                  type="number"
                  value={editFormData.down_payment}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Mileage"
                  name="mileage"
                  type="number"
                  value={editFormData.mileage}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="MSRP"
                  name="msrp"
                  type="number"
                  value={editFormData.msrp}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Savings"
                  name="savings"
                  type="number"
                  value={editFormData.savings || ''}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  name="tags"
                  value={editFormData.tags || ''}
                  onChange={handleEditChange}
                  helperText="e.g. Luxury,SUV,Featured"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleEditChange}
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Current Image
                </Typography>
                
                {currentImageUrl && !editImagePreview && (
                  <Box sx={{ mt: 2, maxWidth: 300 }}>
                    <img src={currentImageUrl} alt="Current image" style={{ width: '100%' }} />
                  </Box>
                )}
                
                {editImagePreview && (
                  <Box sx={{ mt: 2, maxWidth: 300 }}>
                    
                    <img src={editImagePreview} alt="New image preview" style={{ width: '100%' }} />
                  </Box>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Change Image (Optional)
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="edit-image-upload"
                    type="file"
                    onChange={handleEditImageChange}
                  />
                  <label htmlFor="edit-image-upload">
                    <Button variant="contained" component="span" sx={{ mr: 2, backgroundColor:"grey", fontSize:".75rem", border:"none"}}>
                      {editImagePreview ? 'Change Image' : 'Upload New Image'}
                    </Button>
                  </label>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} sx={{backgroundColor:"red", fontSize:".75rem", border:"none"}}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            color="primary" 
            variant="contained"
            disabled={editSubmitting}
            sx={{fontSize:".8rem", border:"none"}}
          >
            {editSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage; 