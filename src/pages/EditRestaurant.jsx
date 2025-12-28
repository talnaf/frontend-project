import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Paper, CircularProgress } from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { fetchRestaurants, updateRestaurant } from "../api/api";

function EditRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    borough: "",
    building: "",
    street: "",
    zipcode: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const data = await fetchRestaurants();
        const restaurant = data.find((r) => r._id === id);

        if (restaurant) {
          setFormData({
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            borough: restaurant.borough,
            building: restaurant.address.building,
            street: restaurant.address.street,
            zipcode: restaurant.address.zipcode,
          });
        } else {
          alert("Restaurant not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading restaurant:", error);
        alert("Failed to load restaurant");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        name: formData.name,
        cuisine: formData.cuisine,
        borough: formData.borough,
        address: {
          building: formData.building,
          street: formData.street,
          zipcode: formData.zipcode,
        },
      };

      await updateRestaurant(id, updatedData);
      navigate("/");
    } catch (error) {
      console.error("Failed to update restaurant:", error);
      alert("Failed to update restaurant. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Restaurant
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
              startIcon={<SaveIcon />}
              size="large"
              fullWidth>
              Save Changes
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

export default EditRestaurant;
