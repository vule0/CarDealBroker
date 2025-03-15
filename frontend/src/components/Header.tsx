import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import logo from "../assets/CarDealBrokerWhiteSmall.jpg";

interface HeaderProps {
  onFormSelect: (formType: "lease" | "sell") => void;
}
const Header: React.FC<HeaderProps> = ({ onFormSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const headerHeight = theme.spacing(5);

  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: "#FFF" }} elevation={6}>
        <Toolbar sx={{ justifyContent: isMobile ? "center" : "left", px: isMobile ? 2 : 5, py: 0.5 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" color="primary" className="fw-bold">
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
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: isMobile ? "none" : "flex", alignItems: "center", flexGrow: 1 }}>
            {/* <Button ></Button> */}
            <Link
              to="about-component"
              smooth={true}
              offset={-100}
              style={{
                fontSize: "1rem",
                padding: "0 16px",
                color: "black",
                // textDecoration: "none",
                // textTransform: "none",
                cursor: "pointer",
                '&hover': {
                transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out'},
              }}
            >
              About Us
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
              onClick={() => onFormSelect("lease")}
            >
              Lease Your Car
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
