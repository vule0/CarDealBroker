import React, { useState, useMemo, useRef } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogActions, 
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  SelectChangeEvent,
  Slider,
  TextField,
  Stack,
  Alert,
  Snackbar,
  Collapse
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import DealCard from "../components/DealCard.tsx";
import { Deal, sampleDeals } from "../types/deals";
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ScrollToTop from "../components/ScrollToTop.tsx";

// Extract all unique tags from sample deals
const allTags = Array.from(
  new Set(sampleDeals.flatMap(deal => deal.tags || []))
).sort();

// Extract all unique makes from sample deals
const allMakes = Array.from(
  new Set(sampleDeals.map(deal => deal.make))
).sort();

// Contact form initial state
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
};

const DealsPage: React.FC = () => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Filter states
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const minPrice = 0;
  const maxPrice = Math.max(...sampleDeals.map(deal => deal.leasePrice)) + 100;

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setDialogOpen(true);
    setShowContactForm(false);
    setFormData(initialFormData);
    setFormSubmitted(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShowContactForm(false);
  };
  
  const handleContactClick = () => {
    setShowContactForm(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the data to your backend here
    console.log('Form submitted:', formData, 'Deal:', selectedDeal);
    setFormSubmitted(true);
    setSnackbarOpen(true);
    
    // Reset form after successful submission
    // setTimeout(() => {
    //   setDialogOpen(false);
    //   setShowContactForm(false);
    //   setFormData(initialFormData);
    // }, 2000);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleMakeChange = (event: SelectChangeEvent) => {
    setSelectedMake(event.target.value);
  };
  
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const resetFilters = () => {
    setSelectedMake('all');
    setPriceRange([minPrice, maxPrice]);
    setSelectedTags([]);
  };

  // Filter deals based on selected filters
  const filteredDeals = useMemo(() => {
    return sampleDeals.filter(deal => {
      // Filter by vehicle make
      if (selectedMake !== 'all' && deal.make !== selectedMake) {
        return false;
      }
      
      // Filter by price range
      if (deal.leasePrice < priceRange[0] || deal.leasePrice > priceRange[1]) {
        return false;
      }
      
      // Filter by selected tags
      if (selectedTags.length > 0) {
        const dealTags = deal.tags || [];
        const hasSelectedTag = dealTags.some(tag => selectedTags.includes(tag));
        if (!hasSelectedTag) return false;
      }
      
      return true;
    });
  }, [selectedMake, priceRange, selectedTags]);

  return (
    <Box sx={{ padding: 2, marginTop: 8 }}>
        <ScrollToTop/>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 600, mb: 4 }}>
          Featured Deals
        </Typography>
        
        {/* Filters Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center', 
              p: 2,
              backgroundColor: '#808080',
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onClick={() => setFiltersExpanded(prev => !prev)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterAltIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
                Filter Deals
              </Typography>
            </Box>
            <IconButton 
              sx={{ color: 'white' }}
              size="small"
            >
              {filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={filtersExpanded}>
            <Box sx={{ p: 3, backgroundColor: '#f8f8f8' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="vehicle-make-label">Vehicle Make</InputLabel>
                    <Select
                      labelId="vehicle-make-label"
                      id="vehicle-make"
                      value={selectedMake}
                      label="Vehicle Make"
                      onChange={handleMakeChange}
                    >
                      <MenuItem value="all">All Makes</MenuItem>
                      {allMakes.map((make) => (
                        <MenuItem key={make} value={make}>{make}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                  
                <Grid item xs={12} sm={6} md={6}>
                  <Typography id="price-range-slider" gutterBottom>
                    Monthly Payment
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={minPrice}
                      max={maxPrice}
                      step={50}
                      marks={[
                        { value: minPrice, label: `$${minPrice}` },
                        { value: maxPrice, label: `$${maxPrice}` }
                      ]}
                      valueLabelFormat={(value) => `$${value}`}
                      aria-labelledby="price-range-slider"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">${priceRange[0]}</Typography>
                    <Typography variant="body2">${priceRange[1]}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                    Features
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: 'white',
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.8,
                      minHeight: '80px',
                      alignContent: 'flex-start'
                    }}
                  >
                    {allTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleTagToggle(tag)}
                        color={selectedTags.includes(tag) ? "primary" : "default"}
                        variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                        size="medium"
                        sx={{ 
                          m: 0.5,
                          borderRadius: '16px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      />
                    ))}
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {filteredDeals.length} {filteredDeals.length === 1 ? 'Deal' : 'Deals'} matching your filters
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  onClick={resetFilters} 
                  sx={{ 
                    color: 'white',
                    backgroundColor: "red",
                    borderColor: '#1dacf0', 
                    
                  }}
                >
                  Reset Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Paper>
        
        {/* Results count */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {filteredDeals.length} {filteredDeals.length === 1 ? 'Deal' : 'Deals'} Found
          </Typography>
          {/* {!filtersExpanded && (
            <Button
              startIcon={<FilterAltIcon />}
              onClick={() => setFiltersExpanded(true)}
              variant="outlined"
              size="small"
              sx={{ 
                color: '#1dacf0',
                borderColor: '#1dacf0', 
                '&:hover': { 
                  borderColor: '#1789c2',
                  backgroundColor: 'rgba(29, 172, 240, 0.08)'
                } 
              }}
            >
              Show Filters
            </Button>
          )} */}
        </Box>
        
        {/* Deals Grid */}
        {filteredDeals.length > 0 ? (
          <Grid container spacing={4}>
            {filteredDeals.map((deal) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={deal.id}>
                <DealCard deal={deal} onDealClick={handleDealClick} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No deals match your filters
            </Typography>
            <Button 
              variant="contained" 
              onClick={resetFilters}
              sx={{ mt: 2 }}
            >
              Reset Filters
            </Button>
          </Box>
        )}
        
        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Looking for something specific?
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
            We can help you find the perfect vehicle at the best possible price. 
            Our team has access to exclusive deals and can negotiate on your behalf.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            component={RouterLink}
            to={{
              pathname: "/",
              hash: "lease-sell-form"
            }}
            state={{ selectedForm: "consultation" }}
            sx={{ 
              px: 4,
              py: 1.5,
              bgcolor: '#323435',
              '&:hover': {
                bgcolor: '#1dacf0',
              }
            }}
          >
            Contact Us Now
          </Button>
        </Box>
      </Container>

      {/* Detail Dialog with Contact Form */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md"
        fullWidth
      >
        {selectedDeal && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: '#f5f5f5',
              py: 1.5
            }}>
              <Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0 }}>
                  {selectedDeal.year} {selectedDeal.make}
                </Typography>
                <Typography variant="h6" component="div" color="primary.main">
                  {selectedDeal.model}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} size="large">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box 
                    component="img" 
                    src={selectedDeal.image} 
                    alt={`${selectedDeal.year} ${selectedDeal.make} ${selectedDeal.model}`} 
                    sx={{ 
                      width: '100%', 
                      borderRadius: 1,
                      maxHeight: '220px',
                      objectFit: 'cover'
                    }} 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ${selectedDeal.leasePrice}/month
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Term:</strong> {selectedDeal.term} months
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Down:</strong> ${selectedDeal.downPayment.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Mileage:</strong> {selectedDeal.mileage.toLocaleString()}/yr
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>MSRP:</strong> <span style={{textDecoration: 'line-through'}}>${selectedDeal.msrp.toLocaleString()}</span>
                        </Typography>
                      </Grid>
                    </Grid>
                    {selectedDeal.savings && (
                      <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold', mt: 1 }}>
                        <strong>Save:</strong> ${selectedDeal.savings.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {!showContactForm && selectedDeal.description && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
                      About this offer
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedDeal.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Limited time offer. Subject to credit approval. Additional fees may apply.
                    </Typography>
                  </Grid>
                )}
                
                {showContactForm && (
                  <Grid item xs={12}>
                    <Box component="form" onSubmit={handleFormSubmit} ref={formRef} sx={{ mt: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Contact us about this {selectedDeal.year} {selectedDeal.make} {selectedDeal.model}
                      </Typography>
                      
                      {formSubmitted ? (
                        <Alert severity="success" sx={{ my: 1 }}>
                          Thank you! Your information has been submitted. Our team will contact you shortly.
                        </Alert>
                      ) : (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                          {/* Name fields row */}
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                              required
                              fullWidth
                              id="firstName"
                              name="firstName"
                              label="First Name"
                              value={formData.firstName}
                              onChange={handleFormChange}
                              size="small"
                            />
                            <TextField
                              required
                              fullWidth
                              id="lastName"
                              name="lastName"
                              label="Last Name"
                              value={formData.lastName}
                              onChange={handleFormChange}
                              size="small"
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                              required
                              fullWidth
                              id="email"
                              name="email"
                              label="Email"
                              type="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              size="small"
                            />
                            <TextField
                              required
                              fullWidth
                              id="phone"
                              name="phone"
                              label="Phone Number"
                              value={formData.phone}
                              onChange={handleFormChange}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary">
                            By submitting, you agree to be contacted about this vehicle deal.
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 2, py: 1.5 }}>
              <Button 
                variant="outlined" 
                onClick={handleCloseDialog}
                size="small"
                sx={{ 
                  mr: 1,
                  color: 'white',
                  bgcolor: '#f44336',
                  '&:hover': {
                    bgcolor: '#d32f2f',
                  }
                }}
              >
                Close
              </Button>
              {!showContactForm && (
                <Button 
                  variant="contained"
                  onClick={handleContactClick}
                  size="small"
                  sx={{ 
                    bgcolor: '#1dacf0',
                    '&:hover': {
                      bgcolor: '#1789c2',
                    }
                  }}
                >
                  Contact About This Deal
                </Button>
              )}
              {showContactForm && !formSubmitted && (
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  onClick={() => formRef.current?.requestSubmit()}
                  sx={{ 
                    bgcolor: '#1dacf0',
                    '&:hover': {
                      bgcolor: '#1789c2',
                    }
                  }}
                >
                  Submit
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Your information has been submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DealsPage;