import React, { useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, InputAdornment, Slider , Typography} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from "axios";

interface LeaseOrSellProps {
  formType: boolean;  // Prop to determine which form to display
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
  condition: string,
  twoKeys: boolean;
  majorDamage: boolean;
}

const LeaseOrSell: React.FC<LeaseOrSellProps> = ({ formType }) => {
  // State to handle form input values
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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFormData((prevData: any) => ({
      ...prevData,
      condition: newValue.toString(),
    }));
  };
  // Handle submit
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent the default form submit behavior
    
    try {
      const response = await axios.post('http://localhost:8000/submit_form/', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box component="form" onSubmit={submitForm} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="First Name"
          variant="outlined"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          required
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        label="Phone Number"
        variant="outlined"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Email"
        variant="outlined"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
      />
    </Box>
      {formType ? (
        // Lease Form Fields
        <>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Vehicle Make"
            variant="outlined"
            name="vehicleMake"
            value={formData.vehicleMake}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Vehicle Model"
            variant="outlined"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
            fullWidth
            required
          />
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
          <TextField
            label="Zip Code"
            variant="outlined"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Miles per Year"
            variant="outlined"
            name="milesPerYear"
            value={formData.milesPerYear}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Credit Score"
            variant="outlined"
            name="creditScore"
            value={formData.creditScore}
            onChange={handleChange}
            fullWidth
            required
          />
          </Box>
        </>
      ) : (
        // Sell Form Fields
        <>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="VIN"
              variant="outlined"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Miles"
              variant="outlined"
              name="miles"
              value={formData.miles}
              onChange={handleChange}
              fullWidth
              required
            />
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
                    <AttachMoneyIcon /> {/* Icon in front of the Payoff Amount */}
                  </InputAdornment>
                ),
              }}
            />

          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            {/* Slider takes up 50% of the row */}
            <Box sx={{ width: "50%" }}>
              <Typography gutterBottom>Condition (1-10)</Typography>
              <Slider
                value={formData.condition}
                onChange={handleSliderChange}
                aria-labelledby="condition-slider"
                fullWidth
                valueLabelDisplay="auto"  // Slider value is now hidden
                step={1}
                min={1}
                max={10}
                sx={{ width: "100%"}} // Smaller slider size
              />
            </Box>

            {/* 2 Keys and Major Damage stacked in a column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2}}>
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
          </Box>
        </>
      )}

      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  );
};

export default LeaseOrSell;
