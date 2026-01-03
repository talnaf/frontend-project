import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Paper, Alert } from "@mui/material";
import { Add as AddIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { createRestaurant } from "../api/api";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    borough: "",
    building: "",
    street: "",
    zipcode: "",
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be signed in to create a restaurant");
      return;
    }

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
        ownerId: user.uid, // Include the owner's Firebase UID
      };

      await createRestaurant(newRestaurant);
      navigate("/restaurant-owner");
    } catch (error) {
      console.error("Failed to create restaurant:", error);
      setError(error.message || "Failed to create restaurant. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Restaurant
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
