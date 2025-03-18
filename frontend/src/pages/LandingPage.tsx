import React, {useState, Dispatch, SetStateAction} from "react";
import { Box, Button, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import ToggleSwitch from "../components/ToggleSwitch";
import heroImage from "../assets/CarDealBrokerLogo.jpg";
import AboutComponent from "../components/AboutComponent";
import LeaseOrSell from "../components/LeaseOrSell";

interface LandingPageProps {
  selectedForm?: "consultation" | "lease" | "sell";
  setSelectedForm?: Dispatch<SetStateAction<"consultation" | "lease" | "sell">>;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  selectedForm: propSelectedForm = "consultation", 
  setSelectedForm: propSetSelectedForm 
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    const [localSelectedForm, setLocalSelectedForm] = useState<"consultation" | "lease" | "sell">(propSelectedForm);
    
    const currentSelectedForm = propSelectedForm || localSelectedForm;
    const setCurrentSelectedForm = (value: "consultation" | "lease" | "sell") => {
      if (propSetSelectedForm) {
        propSetSelectedForm(value);
      } else {
        setLocalSelectedForm(value);
      }
    };

    const handleFormChange = (value: "consultation" | "lease" | "sell") => {
      setCurrentSelectedForm(value);
    };

    const handleButtonClick = (formType: "consultation" | "lease" | "sell") => {
      setCurrentSelectedForm(formType);
    };

  return (
    <Box id="hero-section" sx={{ width: "100%", textAlign: "center" }}>
      <Box
        sx={{
          width: "100%",
          height: isMobile ? "50vh" : "65vh",
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
          textAlign: "center",
    
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          Connect with us Today
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#1dacf0",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 2 : 3,
          justifyContent: "center",
          alignItems: "center",
          px: 0,
          py: 3,
          paddingBottom: 10
        }}
      >
        <Button
          variant="contained"
          component={Link}
          to="lease-sell-form"
          smooth={true}
          onClick={() => handleButtonClick("consultation")}
          sx={{
            backgroundColor: "white",
            color: "#323435",
            fontSize: "1.2rem",
            px: isMobile ? 2 : 4,
            py: 1.5,
            borderRadius: "30px",
            border: "none",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#808080",
              color: "white"
            },
          }}
        >
          Get a Consultation
        </Button>
        
        <Button
          variant="contained"
          component={Link}
          to="lease-sell-form"
          smooth={true}
          onClick={() => handleButtonClick("lease")}
          sx={{
            backgroundColor:"white",
            color:"#323435",
            fontSize: "1.2rem",
            px: isMobile ? 2 : 4,
            py: 1.5,
            borderRadius: "30px",
            border: "none",
            textTransform: "none",
            "&:hover": {
              color: "white",
              backgroundColor: "#808080",
            },
          }}
        >
          Lease A Vehicle
        </Button>
        
        <Button
          variant="contained"
          component={Link}
          to="lease-sell-form"
          smooth={true}
          onClick={() => handleButtonClick("sell")}
          sx={{
            backgroundColor: "white",
            color:"#323435",
            fontSize: "1.2rem",
            px: isMobile ? 2 : 4,
            py: 1.5,
            borderRadius: "30px",
            border: "none",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#808080",
              color: "white"
            },
          }}
        >
          Sell Your Car
        </Button>
      </Box>

      <Container id="about-component">
        <AboutComponent />
      </Container>

      <Container id="lease-sell-form" sx={{ marginBottom: "150px" }}>
      <Box
    sx={{
      backgroundColor: "white",
      borderRadius: "32px",
      boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.2)",
      padding: 5,
      marginTop: 15,
    }}
  >
        <ToggleSwitch selected={currentSelectedForm} onChange={handleFormChange}/>
        {currentSelectedForm === "lease" && (
            <LeaseOrSell formType="lease" />
        )}
        {currentSelectedForm === "sell" && (
            <LeaseOrSell formType="sell" />
        )}
        {currentSelectedForm === "consultation" && (
            <LeaseOrSell formType="consultation" />
        )}
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
