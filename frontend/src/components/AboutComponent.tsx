import React from "react";
import { Box, Typography, Container} from "@mui/material";
import aboutImage from "../assets/CarDealBrokerLogoSmall.jpg"; // Replace with your actual image
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
          <Typography variant="h4" fontWeight="bold" gutterBottom color="black" sx={{ textAlign: 'left', fontSize: '2rem' }}>
            About Us
          </Typography>
          <Typography variant="body1" paragraph color="text.primary" sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500' }}>
            At Car Deal Broker, we believe that buying a car should be exciting—not stressful. 
            That's why we take the hassle out of the dealership experience by handling the negotiations, 
            paperwork, and research for you.
          </Typography>
          <Typography variant="body1" paragraph color="text.primary" sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500' }}>
            With years of experience in the automotive industry, we have deep knowledge of manufacturer 
            incentives, rebates, and special programs, ensuring you get the best possible deal. Whether you're 
            looking for a lease, financing, or a cash purchase, we tailor our services to fit your needs and budget.
          </Typography>
          <Typography variant="body1" paragraph color="text.primary" sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500' }}>
            Our goal is simple: to save you time, money, and frustration. Instead of spending hours at the dealership, 
            let us do the work while you enjoy a seamless and stress-free car-buying experience.
          </Typography>

          {/* Bullet Points */}
          <Typography variant="h6" fontWeight="bold" mt={2} color="black" sx={{ textAlign: 'left', fontSize: '1.5rem' }}>
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

          <Typography variant="body1" mt={2} color="text.primary" sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: '500' }}>
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
            position: "relative",
            '&:hover img': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
            },
          }}
        >
          <img
            src={aboutImage}
            alt="About Image"
            style={{
              width: "100%",
              height: "85vh",
              maxWidth: "500px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box> */}
      </Box>
    </Container>
  );
};

export default AboutComponent;
