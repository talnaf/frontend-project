import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Paper, CircularProgress, Alert } from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon, Upload as UploadIcon } from "@mui/icons-material";
import { getRestaurantByOwnerId, updateRestaurant, uploadRestaurantPicture } from "../api/api";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function EditRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    borough: "",
    building: "",
    street: "",
    zipcode: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!user) {
        // Wait for user authentication to complete
        return;
      }

      try {
        const restaurant = await getRestaurantByOwnerId(user.uid);
        console.log("restaurant:", restaurant);

        if (!restaurant) {
          setError("You don't have a restaurant yet");
          navigate("/restaurant-owner");
          return;
        }

        // Verify that the restaurant ID matches the URL parameter
        if (restaurant._id !== id) {
          setError("You can only edit your own restaurant");
          navigate("/restaurant-owner");
          return;
        }

        setFormData({
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          borough: restaurant.borough,
          building: restaurant.address.building,
          street: restaurant.address.street,
          zipcode: restaurant.address.zipcode,
        });
      } catch (error) {
        console.error("Error loading restaurant:", error);
        setError(error.message || "Failed to load restaurant");
        navigate("/restaurant-owner");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [id, navigate, user]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const processImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be signed in to edit a restaurant");
      return;
    }

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
        ownerId: user.uid, // Include ownerId for authorization
      };

      await updateRestaurant(id, updatedData);

      // Upload image if one was selected
      if (selectedImage) {
        await uploadRestaurantPicture(id, selectedImage);
      }

      navigate("/restaurant-owner");
    } catch (error) {
      console.error("Failed to update restaurant:", error);
      setError(error.message || "Failed to update restaurant. Please try again.");
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

          {/* Image Upload Section */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Restaurant Picture
            </Typography>

            {/* Drag and Drop Zone */}
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: isDragging ? '#e3f2fd' : '#fafafa',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                mb: 2,
              }}>
              <UploadIcon sx={{ fontSize: 48, color: isDragging ? '#1976d2' : '#999', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                {isDragging ? 'Drop image here' : 'Drag and drop an image here'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ mt: 1 }}>
                Choose Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Preview:
                </Typography>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
                />
              </Box>
            )}
          </Box>

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
