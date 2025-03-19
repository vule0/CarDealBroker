import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../api';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await api.post('/admin/login', { password });
      
      if (response.data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (loginError) setLoginError('');
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Admin Login
          </Typography>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              error={!!loginError}
              autoFocus
              disabled={isLoading}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ width: '50%', py: 1.2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Box>
            <Typography variant="body2" align="center" color="text.secondary">
              This area is restricted to administrators only.
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute; 