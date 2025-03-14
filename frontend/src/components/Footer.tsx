import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import {Instagram} from "@mui/icons-material";

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
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px", 
        backgroundColor: "#323435",
        color: "white",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      {/* Contact Info */}
      <Box>
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
      </Box>

      {/* Social Media Links */}
      <Box sx={{ display: "flex", gap: 1, paddingRight: "15px"}}>
        <IconButton
          component={Link}
          href="https://instagram.com/thecardealbroker"
          target="_blank"
          color="inherit"
        >
          <Instagram />
        </IconButton>
    
        <IconButton
          component={Link}
          href="https://tiktok.com/thecardealbroker"
          target="_blank"
          color="inherit"
        >
          <TikTokIcon size={30} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
