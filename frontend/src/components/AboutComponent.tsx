import React from "react";
import { Box, Typography, Container} from "@mui/material";
// import aboutImage from "../assets/CarDealBrokerLogoSmall.jpg";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AboutComponent: React.FC = () => {

  return (
    <Container sx={{ mt: 5, mb: 10, borderRadius: 2,}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "left",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {/* Left Side: Text Content */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="primary" sx={{ textAlign: 'left', fontSize: '2rem' }}>
            About Us
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500', color: 'text.primary' }}>
            At Car Deal Broker, we believe that buying a car should be exciting—not stressful. 
            That's why we take the hassle out of the dealership experience by handling the negotiations, 
            paperwork, and research for you.
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500', color: 'text.primary' }}>
            With years of experience in the automotive industry, we have deep knowledge of manufacturer 
            incentives, rebates, and special programs, ensuring you get the best possible deal. Whether you're 
            looking for a lease, financing, or a cash purchase, we tailor our services to fit your needs and budget.
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500', color: 'text.primary' }}>
            Our goal is simple: to save you time, money, and frustration. Instead of spending hours at the dealership, 
            let us do the work while you enjoy a seamless and stress-free car-buying experience.
          </Typography>

          {/* Bullet Points */}
          <Typography variant="h6" fontWeight="bold" mt={2} color="primary" sx={{ textAlign: 'left', fontSize: '1.5rem' }}>
            Why Choose Us?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'left' }}>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>
                <CheckCircleIcon color="secondary" style={{ marginRight: '0.5rem' }} />
                Expert Knowledge of Manufacturer Incentives & Programs
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>
                <CheckCircleIcon color="secondary" style={{ marginRight: '0.5rem' }} />
                Hassle-Free Negotiation & Paperwork Handling
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500'  }}>
                <CheckCircleIcon color="secondary" style={{ marginRight: '0.5rem' }} />
                Personalized Service & Transparent Pricing
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500'  }}>
                <CheckCircleIcon color="secondary" style={{ marginRight: '0.5rem' }} />
                Save Time & Get the Best Deal
              </li>
            </ul>
          </Box>

          <Typography variant="body1" mt={2} sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500', color: 'text.primary' }}>
            Let us find the perfect car for you—without the dealership hassle. Contact us today and experience 
            a smarter way to buy a car!
          </Typography>
        </Box>

        {/* Right Side: Image */}
        {/* <Box
          sx={{
            flex: 0.75,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            mt: { xs: 2, md: 0 },
            mb: { xs: 2, md: 0 },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px",
              border: "4px solid white",
              backgroundColor: "transparent",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
              },
            }}
          >
            <img
              src={aboutImage}
              alt="About Car Deal Broker"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "500px",
                maxHeight: "600px",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                transition: "transform 0.5s ease",
              }}
            />
          </Paper>
        </Box> */}
      </Box>
    </Container>
  );
};

export default AboutComponent;
