import React from "react";
import { Box, Typography, Container } from "@mui/material";
import aboutImage from "../assets/samplepic.png"; // Replace with your actual image

const AboutComponent: React.FC = () => {
  return (
    <Container id="about-component" sx={{ mt: 5, mb: 10 }}>
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            At <strong>Car Deal Broker</strong>, we believe that buying a car should be exciting—not stressful. 
            That’s why we take the hassle out of the dealership experience by handling the negotiations, 
            paperwork, and research for you.
          </Typography>
          <Typography variant="body1" paragraph>
            With years of experience in the automotive industry, we have deep knowledge of manufacturer 
            incentives, rebates, and special programs, ensuring you get the best possible deal. Whether you’re 
            looking for a lease, financing, or a cash purchase, we tailor our services to fit your needs and budget.
          </Typography>
          <Typography variant="body1" paragraph>
            Our goal is simple: to save you time, money, and frustration. Instead of spending hours at the dealership, 
            let us do the work while you enjoy a seamless and stress-free car-buying experience.
          </Typography>

          {/* Bullet Points */}
          <Typography variant="h6" fontWeight="bold" mt={2}>
            Why Choose Us?
          </Typography>
          <ul>
            <li>✔ Expert Knowledge of Manufacturer Incentives & Programs</li>
            <li>✔ Hassle-Free Negotiation & Paperwork Handling</li>
            <li>✔ Personalized Service & Transparent Pricing</li>
            <li>✔ Save Time & Get the Best Deal</li>
          </ul>

          <Typography variant="body1" mt={2}>
            Let us find the perfect car for you—without the dealership hassle. Contact us today and experience 
            a smarter way to buy a car!
          </Typography>
        </Box>

        {/* Right Side: Image */}
        <Box
          sx={{
            flex: .75,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={aboutImage}
            alt="About CAR DEAL BROKER"
            style={{
              width: "100%",
              height:"85vh",
              maxWidth: "500px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default AboutComponent;
