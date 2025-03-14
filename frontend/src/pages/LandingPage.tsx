import React, {useState} from "react";
import { Box, Button, Container, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import ToggleSwitch from "../components/ToggleSwitch";
import heroImage from "../assets/CarDealBrokerLogo.jpg"; // Replace with your image path
import AboutComponent from "../components/AboutComponent";
import LeaseOrSell from "../components/LeaseOrSell";
import Header from '../components/Header'

const LandingPage: React.FC = () => {

    const [selectedForm, setSelectedForm] = useState<"lease" | "sell" | null>("lease");
    const [isChecked, setIsChecked] = useState(false);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsChecked(isChecked);
        setSelectedForm(isChecked ? "sell" : "lease"); // Switch form based on toggle
      };

      const handleButtonClick = (formType: "lease" | "sell") => {
        setSelectedForm(formType);
        setIsChecked(formType === "sell"); // Set toggle based on selected form
      };

  return (
    <Box id= "hero-section" sx={{ width: "100%", textAlign: "center" }}>
      <Header onFormSelect={handleButtonClick}/>
      {/* Hero Image */}
      <Box
        sx={{
          width: "100%",
          height: "70vh",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#1dacf0",
          py: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center", // Ensures text is centered
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "2rem", // Adjust size as needed
          }}
        >
          Request Our Help Today
        </Typography>
      </Box>
      {/* Buttons BELOW the image */}
      <Box
        sx={{
          width: "100%", // Full screen width
          backgroundColor: "#1dacf0",
          display: "flex",
          gap: 3,
          justifyContent: "center",
          alignItems: "center",
          px: 0,
          py: 2, // Adds spacing above & below buttons
          paddingBottom: 12
        }}
      >
        <Button
        
          variant="contained"
          component={Link}
          to="lease-sell-form"
          smooth={true}
          onClick={() => handleButtonClick("lease")}
          sx={{
            backgroundColor: "white",
            color: "black",
            fontSize: "1.2rem",
            px: 4,
            py: 1.5,
            borderRadius: "30px",
            
            textTransform: "none",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Lease A Vehicle
        </Button>
        <Typography
          sx={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "light",
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          or
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="lease-sell-form"
          smooth={true}
          onClick={() => handleButtonClick("sell")}
          sx={{
            backgroundColor: "white",
            color: "black",
            fontSize: "1.2rem",
            px: 4,
            py: 1.5,
            borderRadius: "30px",
            textTransform: "none",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Sell Your Car
        </Button>
      </Box>

      <Container>
        <AboutComponent />
      </Container>

      {/* Toggle Switch BELOW the buttons */}
      <Container id="lease-sell-form" sx={{ marginBottom: "150px" }}>
      <Box
    sx={{
      backgroundColor: "white",
      borderRadius: "32px",
      boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.2)",
      padding: 2,
      marginTop: 4,
    }}
  >
        <ToggleSwitch checked={isChecked} onChange={handleFormChange}/>
        {selectedForm === "lease" && (
            <LeaseOrSell formType={selectedForm === "lease" ? true : false} />
        )}
        {selectedForm === "sell" && (
            <LeaseOrSell formType={selectedForm === "sell" ? false : true} />
        )}
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
