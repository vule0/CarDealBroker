import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Button
} from '@mui/material';
import { Demo } from '../types/demos';

interface DemoCardProps {
  demo: Demo;
  onDemoClick?: (demo: Demo) => void;
}

const DemoCard: React.FC<DemoCardProps> = ({ demo, onDemoClick }) => {
  const handleClick = () => {
    if (onDemoClick) {
      onDemoClick(demo);
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={demo.image_url}
          alt={`${demo.year} ${demo.make} ${demo.model}`}
        />
        {demo.savings && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              bgcolor: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: 1,
              padding: '4px 8px'
            }}
          >
            <Typography variant="body2" fontWeight="bold" color="error">
              Save ${demo.savings.toLocaleString()}
            </Typography>
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {demo.year} {demo.make}
        </Typography>
        
        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
          {demo.model}
        </Typography>
        
        {demo.tags && demo.tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            {demo.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                color={tag === 'Featured' || tag === 'Limited' ? 'primary' : 'default'} 
              />
            ))}
          </Stack>
        )}
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">MSRP:</Typography>
            <Typography variant="body2" sx={{ }}>${demo.msrp.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">Mileage:</Typography>
            <Typography variant="body2">{demo.mileage.toLocaleString()}/yr</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">${demo.lease_price}/mo</Typography>
            <Typography variant="body2">
              {demo.term} months | ${demo.down_payment.toLocaleString()} down
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={handleClick}
              sx={{ 
                mt: 1,
                px: 4,
                width: '75%',
                bgcolor: '#1dacf0',
                '&:hover': {
                  bgcolor: '#1789c2',
                }
              }}
            >
              Book a Demo
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DemoCard; 