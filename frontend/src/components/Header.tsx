import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import logo from "../assets/CarDealBrokerWhiteSmall.jpg";


interface HeaderProps {
  onFormSelect: (formType: "lease" | "sell") => void;
}
const Header: React.FC<HeaderProps> = ({ onFormSelect }) => {
  const theme = useTheme();
  const headerHeight = theme.spacing(5);

  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: "#FFF" }} elevation={6}>
        <Toolbar className="d-flex justify-content-between px-5 py-3">
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
                    height: "50px",
                    width: "auto",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                />
              </Link>
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box className="d-flex gap-4">
            <Link
              to="about-component"
              smooth={true}
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
        </Toolbar>
      </AppBar>

      <Box sx={{ paddingTop: headerHeight }}></Box>
    </Box>
  );
};

export default Header;
