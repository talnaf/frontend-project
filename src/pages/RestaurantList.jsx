import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
} from "@mui/icons-material";
import { fetchRestaurants, searchRestaurants } from "../api/api";
import placeholderImg from "../assets/404_bg.png";
import "./RestaurantList.scss";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [searchParameter, setSearchParameter] = useState("name");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageLimit = 3;

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      try {
        let data;
        if (activeSearchQuery) {
          // Use backend search when there's a search query
          data = await searchRestaurants(searchParameter, activeSearchQuery, page, pageLimit);
        } else {
          // Use regular fetch when no search query
          data = await fetchRestaurants(page, pageLimit);
        }
        console.log("data:", data);
        if (data) {
          setRestaurants(data.restaurants);
          setTotalPages(data.pagination?.totalPages);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [page, activeSearchQuery, searchParameter]);

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setPage(1);
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
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="search-parameter-label">Search By</InputLabel>
          <Select
            labelId="search-parameter-label"
            id="search-parameter"
            value={searchParameter}
            label="Search By"
            onChange={(e) => setSearchParameter(e.target.value)}>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="cuisine">Cuisine</MenuItem>
            <MenuItem value="borough">Borough</MenuItem>
            <MenuItem value="address">Address</MenuItem>
            <MenuItem value="grade">Grade</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search restaurants by ${searchParameter}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ minWidth: 100 }}>
          Search
        </Button>
        {activeSearchQuery && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearSearch}
            sx={{ minWidth: 100 }}>
            Clear
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {restaurants?.map((restaurant) => (
          <Grid xs={12} sm={6} md={4} lg={3} xl={2} key={restaurant._id}>
            <Card elevation={3} className="restaurant-card">
              <CardMedia
                component="img"
                height="200"
                image={restaurant.picture || placeholderImg}
                alt={restaurant.name}
                sx={{ objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImg;
                }}
              />
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
                  <strong>Address:</strong> {restaurant.address.building}{" "}
                  {restaurant.address.street}, {restaurant.address.zipcode}
                </Typography>
                {restaurant.grades && restaurant.grades.length > 0 && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Latest Grade:</strong> {restaurant.grades[0].grade} (Score:{" "}
                    {restaurant.grades[0].score})
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}

export default RestaurantList;
