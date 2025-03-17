import React, {useState} from "react";
import { Box, Button, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import ToggleSwitch from "../components/ToggleSwitch";
import heroImage from "../assets/CarDealBrokerLogo.jpg";
import AboutComponent from "../components/AboutComponent";
import LeaseOrSell from "../components/LeaseOrSell";
import Header from '../components/Header'
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [selectedForm, setSelectedForm] = useState<"lease" | "sell" | null>("lease");
    const [isChecked, setIsChecked] = useState(false);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsChecked(isChecked);
        setSelectedForm(isChecked ? "sell" : "lease");
      };

      const handleButtonClick = (formType: "lease" | "sell") => {
        setSelectedForm(formType);
        setIsChecked(formType === "sell");
      };

  return (
    <Box id= "hero-section" sx={{ width: "100%", textAlign: "center" }}>
      <Header onFormSelect={handleButtonClick}/>
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
          width: "100%", // Full screen width
          backgroundColor: "#1dacf0",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
          justifyContent: "center",
          alignItems: "center",
          px: 0,
          py: 2,
          paddingBottom: 10
        }}
      >
        <Button
        
          variant="contained"
          component={Link}
          to="lease-sell-form"
          smooth={true}
          onClick={() => handleButtonClick("lease")}
          sx={{
            backgroundColor: "#323435",
            color: "white",
            fontSize: "1.2rem",
            px: isMobile ? 2 : 4,
            py: 1.5,
            borderRadius: "30px",
            border: "none",
            textTransform: "none",
            "&:hover": {
              color:"black",
              backgroundColor:"white",
              // opacity: .75,
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
            color: "#323435",
            fontSize: "1.2rem",
            px: isMobile ? 2 : 4,
            py: 1.5,
            borderRadius: "30px",
            border: "none",
            textTransform: "none",
            "&:hover": {
              // opacity: .75,
              backgroundColor: "#323435",
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
        <ToggleSwitch checked={isChecked} onChange={handleFormChange}/>
        {selectedForm === "lease" && (
            <LeaseOrSell formType={selectedForm === "lease" ? true : false} />
        )}
        {selectedForm === "sell" && (
            <LeaseOrSell formType={selectedForm === "sell" ? false : true} />
        )}
        </Box>
      </Container>
      <Footer/>
    </Box>
  );
};

export default LandingPage;
