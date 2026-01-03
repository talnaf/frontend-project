import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  ArrowBack as ArrowBackIcon,
  Grade as GradeIcon,
} from "@mui/icons-material";
import { getRestaurantById } from "../api/api";
import placeholderImg from "../assets/404_bg.png";

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error("Error loading restaurant:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Restaurant not found"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}>
            Back to Restaurants
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
   
      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        {/* Restaurant Image */}
        <Box
          component="img"
          src={restaurant.picture || placeholderImg}
          alt={restaurant.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
          sx={{
            width: "100%",
            height: { xs: 300, sm: 400, md: 500 },
            objectFit: "cover",
          }}
        />

        {/* Restaurant Information */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* Header Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {restaurant.name}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              <Chip
                icon={<RestaurantIcon />}
                label={restaurant.cuisine}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<LocationIcon />}
                label={restaurant.borough}
                color="secondary"
                variant="outlined"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Details Grid */}
          <Grid container spacing={4}>
            {/* Address Section */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6">Address</Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.address.building} {restaurant.address.street}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.borough}, {restaurant.address.zipcode}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Cuisine Section */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <RestaurantIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6">Cuisine Type</Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.cuisine}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Grades Section */}
            {restaurant.grades && restaurant.grades.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <GradeIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="h6">Inspection Grades</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {restaurant.grades.slice(0, 5).map((grade, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            bgcolor: index === 0 ? "primary.lighter" : "background.default",
                            borderRadius: 1,
                          }}>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Grade: {grade.grade}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(grade.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={`Score: ${grade.score}`}
                            color={grade.score < 14 ? "success" : grade.score < 28 ? "warning" : "error"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Restaurant ID */}
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Restaurant ID: {restaurant.restaurant_id || restaurant._id}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default RestaurantDetail;