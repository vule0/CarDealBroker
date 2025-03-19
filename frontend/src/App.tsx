import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import DealsPage from './pages/DealsPage';
import DemosPage from './pages/DemosPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
// import ScrollToTop from './components/ScrollToTop';
import { useState } from 'react';
import { Box } from '@mui/material';

function App() {
  const [selectedForm, setSelectedForm] = useState<"consultation" | "lease" | "sell">("consultation");

  const handleFormSelect = (formType: "consultation" | "lease" | "sell") => {
    setSelectedForm(formType);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {/* <ScrollToTop /> */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header onFormSelect={handleFormSelect} />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <LandingPage 
                    selectedForm={selectedForm} 
                    setSelectedForm={setSelectedForm} 
                  />
                } 
              />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/demos" element={<DemosPage />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
