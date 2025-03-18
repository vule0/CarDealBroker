import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import logo from "../assets/CarDealBrokerWhiteSmall.jpg";

interface HeaderProps {
  onFormSelect: (formType: "lease" | "sell") => void;
}
const Header: React.FC<HeaderProps> = ({ onFormSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const headerHeight = theme.spacing(5);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: "#FFF" }} elevation={6}>
        <Toolbar sx={{ justifyContent: isMobile ? "center" : "left", px: isMobile ? 2 : 5, py: 0.5 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" color="primary" className="fw-bold">
              {isLandingPage ? (
                <Link
                  to="hero-section"
                  smooth={true}
                  className="text-decoration-none text-primary"
                  
                >
                  <img
                    src={logo}
                    alt="CarDealBroker Logo"
                    style={{
                      height: isMobile ? "40px" : "50px",
                      width: "auto",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                </Link>
              ) : (
                <RouterLink to="/" style={{ textDecoration: 'none' }}>
                  <img
                    src={logo}
                    alt="CarDealBroker Logo"
                    style={{
                      height: isMobile ? "40px" : "50px",
                      width: "auto",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                </RouterLink>
              )}
            </Typography>
          </Box>

          <Box sx={{ display: isMobile ? "none" : "flex", alignItems: "center", flexGrow: 1 }}>
            {isLandingPage ? (
              <Link
                to="about-component"
                smooth={true}
                offset={-100}
                style={{
                  fontSize: "1rem",
                  padding: "0 16px",
                  color: "black",
                  textDecoration: "none",
                  textTransform: "none",
                  cursor: "pointer",
                }}
              >
                About Us
              </Link>
            ) : (
              <RouterLink
            to={{
              pathname: "/",
              hash: "about-component"
            }}
                // to="/#about-component"
                style={{
                  fontSize: "1rem",
                  padding: "0 16px",
                  color: "black",
                  textDecoration: "none",
                  textTransform: "none",
                }}
              >
                About Us
              </RouterLink>
            )}

            {isLandingPage ? (
              <>
                <Link
                  to="lease-sell-form"
                  smooth={true}
                  style={{
                    fontSize: "1rem",
                    padding: "0 16px",
                    color: "black",
                    textDecoration: "none",
                    textTransform: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => onFormSelect("lease")}
                >
                  Lease A Car
                </Link>

                <Link
                  to="lease-sell-form"
                  smooth={true}
                  style={{
                    fontSize: "1rem",
                    padding: "0 16px",
                    color: "black",
                    textDecoration: "none",
                    textTransform: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => onFormSelect("sell")}
                >
                  Sell Your Car
                </Link>
              </>
            ) : (
              <>
                <RouterLink
                  // to="/#lease-sell-form"
                  to={{
                    pathname: "/",
                    hash: "lease-sell-form"
                  }}
        
                  state={{ selectedForm: "lease" }}
                  onClick={() => onFormSelect("lease")}
                  style={{
                    fontSize: "1rem",
                    padding: "0 16px",
                    color: "black",
                    textDecoration: "none",
                    textTransform: "none",
                  }}
                >
                  Lease A Car
                </RouterLink>

                <RouterLink
                
                
                to={{
                  pathname: "/",
                  hash: "lease-sell-form"
                }}
      
                state={{ selectedForm: "sell" }}
                  onClick={() => onFormSelect("sell")}
                  style={{
                    fontSize: "1rem",
                    padding: "0 16px",
                    color: "black",
                    textDecoration: "none",
                    textTransform: "none",
                  }}
                >
                  Sell Your Car
                </RouterLink>
              </>
            )}
            
            <RouterLink 
              to="/deals" 
              style={{
                fontSize: "1rem",
                padding: "0 16px",
                color: "black",
                textDecoration: "none",
                textTransform: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Deals
            </RouterLink>
          </Box>
          <Box>
            <a href="tel:+19546957069" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{ margin: 0, padding: isMobile ? ".5rem 1rem" : ".5rem 2rem" }}
              >
                CALL: (954) 695-7069
              </Button>
            </a>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ paddingTop: headerHeight }}></Box>
    </Box>
  );
};

export default Header;
