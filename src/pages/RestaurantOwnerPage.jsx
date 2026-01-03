import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Logout as LogoutIcon,
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserByUid } from "../api/api";
import { RoutesEnum } from "../utils";

function RestaurantOwnerPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const mongoUser = await getUserByUid(firebaseUser.uid);
          setUserData(mongoUser);

          // Redirect if not a restaurant owner
          if (mongoUser.role !== "restaurantOwner") {
            navigate(RoutesEnum.USER_PAGE);
            return;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate(RoutesEnum.Home);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate(RoutesEnum.Home);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "secondary.main",
              mr: 3,
            }}>
            <DashboardIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              {userData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Restaurant Owner Account
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <List>
            <ListItem>
              <EmailIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText primary="Email" secondary={userData.email} />
            </ListItem>
            <ListItem>
              <PersonIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText primary="Account Type" secondary="Restaurant Owner" />
            </ListItem>
            <ListItem>
              <RestaurantIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText
                primary="Email Verified"
                secondary={userData.isEmailVerified ? "Yes" : "No"}
              />
            </ListItem>
          </List>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Owner Actions
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              transition: "box-shadow 0.3s",
            }}
            onClick={() => navigate(RoutesEnum.ADD)}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AddIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Typography variant="h6">Add New Restaurant</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Create a new restaurant listing with details, images, and location information.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              transition: "box-shadow 0.3s",
            }}
            onClick={() => navigate(RoutesEnum.Home)}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <RestaurantIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Typography variant="h6">Manage Restaurants</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View, edit, and manage all restaurant listings in the system.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}>
          Sign Out
        </Button>
      </Box>
    </Container>
  );
}

export default RestaurantOwnerPage;