import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import {Instagram} from "@mui/icons-material";
import CarDealBrokerWhiteSmall from "../assets/CarDealBrokerWhiteSmall.jpg";

// Custom TikTok Icon
const TikTokIcon = ({ color = "#FFFFFF", size = 30 }) => {
  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width={size}
      height={size}
    >
      <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
    </svg>
  );
};

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "10px",
        paddingBottom: "15px", 
        backgroundColor: "#323435",
        color: "white",
        bottom: 0,
        width: "100%",
        gap: { xs: 2, md: 0 }
      }}
    >
      {/* Contact Info on the left */}
      <Box sx={{ textAlign: { xs: "center", md: "left" }, order: { xs: 2, md: 1 }, pl: { xs: 0, md: 3 } }}>
        <Typography variant="body1">
          <strong>Contact Info:</strong>
        </Typography>
        <Typography variant="body2">
          <Link href="mailto:deals@cardealbroker.com" color="inherit" sx={{ textDecoration: "none" }}>
            Email: deals@cardealbroker.com
          </Link>
        </Typography>
        <Typography variant="body2">
          <Link href="tel:+19546957069" color="inherit" sx={{ textDecoration: "none" }}>
            Phone: +1 (954) 695-7069
          </Link>
        </Typography>
        {/* <Typography variant="body2" sx={{ mt: 1 }}>
          Copyright © 2025 cardealbroker.com - All Rights Reserved.
        </Typography> */}
      </Box>

      {/* Logo in the center */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        order: { xs: 1, md: 2 },
        mx: "auto"
      }}>
        <Box
          component="img"
          src={CarDealBrokerWhiteSmall}
          alt="Car Deal Broker Logo"
          sx={{
            maxWidth: "250px",
            height: "auto",
            mb: 1
          }}
        />
        
      </Box>
      
      {/* Right side - Reserved text */}
      <Box sx={{ textAlign: { xs: "center", md: "right" }, order: { xs: 3, md: 3 }, pr: { xs: 0, md: 3 } }}>
      <IconButton
            component={Link}
            href="https://instagram.com/thecardealbroker"
            target="_blank"
            color="inherit"
            size="small"
          >
            <Instagram/>
          </IconButton>
      
          <IconButton
            component={Link}
            href="https://tiktok.com/@cardealbroker"
            target="_blank"
            color="inherit"
            size="small"
          >
            <TikTokIcon size={24} />
          </IconButton>
          <Typography variant="body2" sx={{ mt: 1 }}>
          Copyright © 2025 cardealbroker.com - All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
