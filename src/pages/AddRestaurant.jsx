import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Paper } from "@mui/material";
import { Add as AddIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { createRestaurant } from "../api/api";

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    borough: "",
    building: "",
    street: "",
    zipcode: "",
  });
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newRestaurant = {
        name: formData.name,
        cuisine: formData.cuisine,
        borough: formData.borough,
        address: {
          building: formData.building,
          street: formData.street,
          zipcode: formData.zipcode,
          coord: [-73.0, 40.0],
        },
        grades: [],
      };

      await createRestaurant(newRestaurant);
      navigate("/");
    } catch (error) {
      console.error("Failed to create restaurant:", error);
      alert("Failed to create restaurant. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Restaurant
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Cuisine"
            value={formData.cuisine}
            onChange={(e) => handleChange("cuisine", e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Borough"
            value={formData.borough}
            onChange={(e) => handleChange("borough", e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Building"
            value={formData.building}
            onChange={(e) => handleChange("building", e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Street"
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Zipcode"
            value={formData.zipcode}
            onChange={(e) => handleChange("zipcode", e.target.value)}
            required
            margin="normal"
          />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              size="large"
              fullWidth>
              Add Restaurant
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => navigate("/")}
              size="large"
              fullWidth>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddRestaurant;
