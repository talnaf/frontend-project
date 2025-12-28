import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { fetchRestaurants, deleteRestaurant } from "../api/api";
import "./RestaurantList.scss";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants();
        console.log("data:", data);
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await deleteRestaurant(id);
        setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id));
      } catch (error) {
        console.error("Failed to delete restaurant:", error);
        alert("Failed to delete restaurant. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="restaurant-list-container">
      <Box className="restaurant-list-header">
        <Typography variant="h3" component="h1">
          Restaurants
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => navigate("/add")}
          size="large">
          Add New Restaurant
        </Button>
      </Box>
      <Grid container spacing={3}>
        {restaurants?.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={restaurant._id}>
            <Card elevation={3} className="restaurant-card">
              <CardContent className="restaurant-card-content">
                <Typography variant="h5" component="h2" gutterBottom>
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Cuisine:</strong> {restaurant.cuisine}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Borough:</strong> {restaurant.borough}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Address:</strong> {restaurant.address.building} {restaurant.address.street},{" "}
                  {restaurant.address.zipcode}
                </Typography>
                {restaurant.grades && restaurant.grades.length > 0 && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Latest Grade:</strong> {restaurant.grades[0].grade} (Score:{" "}
                    {restaurant.grades[0].score})
                  </Typography>
                )}
              </CardContent>
              <CardActions className="restaurant-card-actions">
                <Box className="button-group">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/edit/${restaurant._id}`)}
                    size="small">
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(restaurant._id)}
                    size="small">
                    Delete
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default RestaurantList;
