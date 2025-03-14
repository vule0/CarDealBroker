import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Slider,
  Typography,
  FormControl,
  Autocomplete,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Confetti from "react-confetti";
import axios from "axios";
import "./LeaseOrSell.css";


interface LeaseOrSellProps {
  formType: boolean;
}
interface FormData {
  formType: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  zipCode: string;
  milesPerYear: string;
  creditScore: string;
  vin: string;
  miles: string;
  payoff: string;
  condition: string;
  twoKeys: boolean;
  majorDamage: boolean;
}

// Explicitly type carData
const carData: Record<string, string[]> = {
  "Acura": ["ILX", "MDX", "RDX", "TLX"],
  "Alfa Romeo": ["Giulia", "Stelvio"],
  "Aston Martin": ["DB11", "Vantage"],
  "Audi": ["A3", "A4", "A6", "Q5", "Q7"],
  "Bentley": ["Bentayga", "Continental GT"],
  "BMW": ["3 Series", "5 Series", "X3", "X5"],
  "Buick": ["Enclave", "Encore", "Envision"],
  "Cadillac": ["CT4", "CT5", "Escalade"],
  "Chevrolet": ["Camaro", "Equinox", "Silverado", "Tahoe"],
  "Chrysler": ["300", "Pacifica"],
  "Dodge": ["Challenger", "Charger", "Durango"],
  "Ferrari": ["488", "Roma"],
  "Fiat": ["500", "500X"],
  "Ford": ["Bronco", "Escape", "F-150", "Mustang"],
  "Genesis": ["G70", "G80", "GV80"],
  "GMC": ["Acadia", "Sierra", "Yukon"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot"],
  "Hyundai": ["Elantra", "Santa Fe", "Sonata", "Tucson"],
  "Infiniti": ["Q50", "QX60"],
  "Jaguar": ["E-Pace", "F-Pace", "XE"],
  "Jeep": ["Cherokee", "Grand Cherokee", "Wrangler"],
  "Kia": ["Forte", "Sorento", "Sportage", "Telluride"],
  "Lamborghini": ["Aventador", "Huracán"],
  "Land Rover": ["Defender", "Discovery", "Range Rover"],
  "Lexus": ["ES", "RX", "NX"],
  "Lincoln": ["Aviator", "Corsair", "Navigator"],
  "Maserati": ["Ghibli", "Levante"],
  "Mazda": ["CX-5", "Mazda3", "Mazda6"],
  "McLaren": ["720S", "GT"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE"],
  "Mini": ["Cooper", "Countryman"],
  "Mitsubishi": ["Eclipse Cross", "Outlander"],
  "Nissan": ["Altima", "Rogue", "Sentra"],
  "Porsche": ["911", "Cayenne", "Macan"],
  "Ram": ["1500", "2500"],
  "Rolls-Royce": ["Ghost", "Phantom"],
  "Subaru": ["Forester", "Impreza", "Outback"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Toyota": ["Camry", "Corolla", "Highlander", "RAV4"],
  "Volkswagen": ["Atlas", "Golf", "Jetta", "Tiguan"],
  "Volvo": ["S60", "XC40", "XC90"]
};


const LeaseOrSell: React.FC<LeaseOrSellProps> = ({ formType }) => {
  const [formData, setFormData] = useState<FormData>({
    formType: formType ? "Lease Form" : "Sell Form",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    vehicleMake: "",
    vehicleModel: "",
    zipCode: "",
    milesPerYear: "",
    creditScore: "",
    vin: "",
    miles: "",
    payoff: "",
    condition: "",
    twoKeys: false,
    majorDamage: false,
  });

  // State to handle selected make and available models
  const [selectedMake, setSelectedMake] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData: FormData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      condition: newValue.toString(),
    }));
  };


  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/submit_form/",
        formData
      );
      console.log(response.data);
      setOpen(true); // Open the dialog on success
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submitForm}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "10px",
        position: "relative",
        height: "420px", 
        overflowY: "auto", 
      }}
    >
      
    
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone Number"
            variant="outlined"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      {formType ? (

        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Autocomplete
                  options={Object.keys(carData)}
                  value={selectedMake}
                  onChange={(event, newValue) => {
                    const make = newValue || "";
                    setSelectedMake(make);
                    setAvailableModels(carData[make] || []);
                    setFormData((prevData) => ({
                      ...prevData,
                      vehicleMake: make,
                      vehicleModel: "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vehicle Make"
                      required
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Autocomplete
                  options={availableModels}
                  value={formData.vehicleModel}
                  disabled={!selectedMake}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({ ...prevData, vehicleModel: newValue || "" }));
                  }}
                  renderInput={(params) => <TextField {...params} label="Vehicle Model" required />}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Zip Code"
                variant="outlined"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Miles per Year"
                variant="outlined"
                name="milesPerYear"
                value={formData.milesPerYear}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Credit Score"
                variant="outlined"
                name="creditScore"
                value={formData.creditScore}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </>
      ) : (
        // Sell Form Fields
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="VIN"
                variant="outlined"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Miles"
                variant="outlined"
                name="miles"
                value={formData.miles}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Payoff Amount"
                variant="outlined"
                name="payoff"
                value={formData.payoff}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom align="left">
                Condition (1-10)
              </Typography>
              <Slider
                onChange={handleSliderChange}
                aria-labelledby="condition-slider"
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={10}
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.twoKeys}
                      onChange={handleChange}
                      name="twoKeys"
                      color="primary"
                    />
                  }
                  label="2 Keys?"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.majorDamage}
                      onChange={handleChange}
                      name="majorDamage"
                      color="primary"
                    />
                  }
                  label="Any Major Damage?"
                />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      <Box className="submit-button">
        <Button variant="contained" type="submit">
          Contact Me!
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Typography>Thank you for your submission!<br />
      Our team will review your request and reach out to you shortly.
          </Typography>
        </DialogContent>
        <DialogActions><Box className="">
          <Button variant="contained" onClick={handleClose} >
            Close
          </Button></Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaseOrSell;
