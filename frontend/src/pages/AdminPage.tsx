import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
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
      // Instead of FormData, send as JSON
      const dealDataWithImage = {
        ...dealFormData,
        image_url: imageUrl
      };
      
      await api.post('/deals/', dealDataWithImage);
      
      // Reset form after successful submission
      setDealFormData(initialDealFormData);
      setDealImageFile(null);
      setDealImagePreview(null);
      showSnackbar('Deal created successfully!', 'success');
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
      // Instead of FormData, send as JSON
      const demoDataWithImage = {
        ...demoFormData,
        image_url: imageUrl
      };
      
      await api.post('/demos/', demoDataWithImage);
      
      // Reset form after successful submission
      setDemoFormData(initialDemoFormData);
      setDemoImageFile(null);
      setDemoImagePreview(null);
      showSnackbar('Demo created successfully!', 'success');
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
          <Tab label="Add Deal" />
          <Tab label="Add Demo" />
        </Tabs>
        
        {/* Add Deal Form */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleDealSubmit}>
            <Typography variant="h6" gutterBottom>
              Add New Deal
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Make"
                  name="make"
                  value={dealFormData.make}
                  onChange={handleDealChange}
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  name="tags"
                  value={dealFormData.tags || ''}
                  onChange={handleDealChange}
                  margin="normal"
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
                  margin="normal"
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
                />
                <label htmlFor="deal-image-upload">
                  <Button variant="contained" component="span" sx={{ mr: 2 }}>
                    Choose Image
                  </Button>
                </label>
                {dealImagePreview && (
                  <Box sx={{ mt: 2, maxWidth: 300 }}>
                    <img src={dealImagePreview} alt="Deal preview" style={{ width: '100%' }} />
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={dealSubmitting}
                  sx={{ mt: 3 }}
                >
                  {dealSubmitting ? <CircularProgress size={24} /> : 'Add Deal'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Add Demo Form */}
        {activeTab === 1 && (
          <Box component="form" onSubmit={handleDemoSubmit}>
            <Typography variant="h6" gutterBottom>
              Add New Demo
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Make"
                  name="make"
                  value={demoFormData.make}
                  onChange={handleDemoChange}
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
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
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  name="tags"
                  value={demoFormData.tags || ''}
                  onChange={handleDemoChange}
                  margin="normal"
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
                  margin="normal"
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
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={demoSubmitting}
                  sx={{ mt: 3 }}
                >
                  {demoSubmitting ? <CircularProgress size={24} /> : 'Add Demo'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage; 