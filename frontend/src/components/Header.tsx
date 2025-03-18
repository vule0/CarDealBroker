import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  Button,
  useMediaQuery,
  Drawer,
  List,
  ListItemText,
  IconButton,
  Divider,
  ListItemButton,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CallIcon from "@mui/icons-material/Call";
import logo from "../assets/CarDealBrokerWhiteSmall.jpg";

interface HeaderProps {
  onFormSelect: (formType: "consultation" | "lease" | "sell") => void;
}

const Header: React.FC<HeaderProps> = ({ onFormSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const headerHeight = theme.spacing(7);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Shared link styles
  const linkStyle = {
    fontSize: "1rem",
    padding: "0 16px",
    color: "black",
    textDecoration: "none",
    textTransform: "none" as const,
    cursor: "pointer",
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: "80%",
          maxWidth: "300px",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={toggleMobileMenu} size="large">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2, pt:5 }}>
        <img src={logo} alt="Car Deal Broker Logo" style={{ height: "100px" }} />
      </Box>
      <Divider />
      <List>
        {isLandingPage ? (
          <>
            <ListItemButton
              component={Link}
              to="about-component"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              onClick={closeMobileMenu}
            >
              <ListItemText 
                primary="About Us" 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 500,
                    textTransform: "none" as const
                  } 
                }}
              />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="lease-sell-form"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              onClick={() => {
                onFormSelect("lease");
                closeMobileMenu();
              }}
            >
              <ListItemText 
                primary="Lease A Car" 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 500,
                    textTransform: "none" as const
                  } 
                }}
              />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="lease-sell-form"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              onClick={() => {
                onFormSelect("sell");
                closeMobileMenu();
              }}
            >
              <ListItemText 
                primary="Sell Your Car" 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 500,
                    textTransform: "none" as const
                  } 
                }}
              />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton
              component={RouterLink}
              to={{
                pathname: "/",
                hash: "about-component"
              }}
              onClick={closeMobileMenu}
            >
              <ListItemText 
                primary="About Us" 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 500,
                    textTransform: "none" as const
                  } 
                }}
              />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to={{
                pathname: "/",
                hash: "lease-sell-form"
              }}
              onClick={() => {
                onFormSelect("lease");
                closeMobileMenu();
              }}
            >
              <ListItemText 
                primary="Lease A Car" 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 500,
                    textTransform: "none" as const
                  } 
                }}
              />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to={{
                pathname: "/",
                hash: "lease-sell-form"
              }}
              onClick={() => {
                onFormSelect("sell");
                closeMobileMenu();
              }}
            >
              <ListItemText 
                primary="Sell Your Car" 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 500,
                    textTransform: "none" as const
                  } 
                }}
              />
            </ListItemButton>
          </>
        )}
        <ListItemButton
          component={RouterLink}
          to="/deals"
          onClick={closeMobileMenu}
        >
          <ListItemText 
            primary="Deals" 
            primaryTypographyProps={{ 
              sx: { 
                fontWeight: 500,
                textTransform: "none" as const
              } 
            }}
          />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/demos"
          onClick={closeMobileMenu}
        >
          <ListItemText 
            primary="Demo Vehicles" 
            primaryTypographyProps={{ 
              sx: { 
                fontWeight: 500,
                textTransform: "none" as const
              } 
            }}
          />
        </ListItemButton>
      </List>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CallIcon />}
          href="tel:+19546957069"
          sx={{
            borderRadius: 50,
            px: 3,
            py: 1,
            textTransform: "none" as const,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Call Us
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: "48px", height: "80px", py: 0, px: { xs: 1, sm: 2 } }}>
          {isLandingPage ? (
            <Link
              to="hero-component"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <img
                src={logo}
                alt="Car Deal Broker Logo"
                style={{ height: headerHeight, marginRight: theme.spacing(1) }}
              />
            </Link>
          ) : (
            <RouterLink to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="Car Deal Broker Logo"
                style={{ height: headerHeight, marginRight: theme.spacing(1) }}
              />
            </RouterLink>
          )}

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color="primary"
                startIcon={<CallIcon />}
                href="tel:+19546957069"
                sx={{
                  borderRadius: 50,
                  mr: 1,
                  px: 2,
                  textTransform: "none" as const,
                  fontSize: ".9rem",
                }}
              >
                Call Us
              </Button>
              <IconButton
                edge="end"
                color="primary"
                aria-label="menu"
                onClick={toggleMobileMenu}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 2,
                }}
              >
                {isLandingPage ? (
                  <>
                    <Link
                      to="about-component"
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={500}
                      style={linkStyle}
                    >
                      <Typography variant="body1">About Us</Typography>
                    </Link>
                    <Link
                      to="lease-sell-form"
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={500}
                      onClick={() => onFormSelect("lease")}
                      style={linkStyle}
                    >
                      <Typography variant="body1">Lease A Car</Typography>
                    </Link>
                    <Link
                      to="lease-sell-form"
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={500}
                      onClick={() => onFormSelect("sell")}
                      style={linkStyle}
                    >
                      <Typography variant="body1">Sell Your Car</Typography>
                    </Link>
                  </>
                ) : (
                  <>
                    <RouterLink
                      to={{
                        pathname: "/",
                        hash: "about-component"
                      }}
                      style={linkStyle}
                    >
                      <Typography variant="body1">About Us</Typography>
                    </RouterLink>
                    <RouterLink
                      to={{
                        pathname: "/",
                        hash: "lease-sell-form"
                      }}
                      onClick={() => onFormSelect("lease")}
                      style={linkStyle}
                    >
                      <Typography variant="body1">Lease A Car</Typography>
                    </RouterLink>
                    <RouterLink
                      to={{
                        pathname: "/",
                        hash: "lease-sell-form"
                      }}
                      onClick={() => onFormSelect("sell")}
                      style={linkStyle}
                    >
                      <Typography variant="body1">Sell Your Car</Typography>
                    </RouterLink>
                  </>
                )}
                <RouterLink to="/deals" style={linkStyle}>
                  <Typography variant="body1">Deals</Typography>
                </RouterLink>
                <RouterLink to="/demos" style={linkStyle}>
                  <Typography variant="body1">Demo Vehicles</Typography>
                </RouterLink>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CallIcon />}
                href="tel:+19546957069"
                sx={{
                  borderRadius: 50,
                  px: 2.5,
                  py: 1,
                  textTransform: "none" as const,
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                Call Us
              </Button>
            </>
          )}
        </Toolbar>
        {renderMobileMenu()}
      </AppBar>

      <Box sx={{ paddingTop: headerHeight }}></Box>
    </Box>
  );
};

export default Header;
