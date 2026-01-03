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
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Logout as LogoutIcon,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserByUid } from "../api/api";
import { RoutesEnum } from "../utils";

function UserPage() {
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              mr: 3,
            }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              {userData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              User Account
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
              <ListItemText primary="Account Type" secondary="User" />
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

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(RoutesEnum.Home)}>
            Browse Restaurants
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default UserPage;