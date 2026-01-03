import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Restaurant as RestaurantIcon, Person as PersonIcon } from "@mui/icons-material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserByUid } from "../api/api";
import { RoutesEnum } from "../utils";
import SignInDialog from "./SignInDialog";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch user data from MongoDB to get name and role
        try {
          const mongoUser = await getUserByUid(firebaseUser.uid);
          setUserData(mongoUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUserClick = () => {
    if (userData) {
      if (userData.role === "restaurantOwner") {
        navigate(RoutesEnum.RESTAURANT_OWNER_PAGE);
      } else {
        navigate(RoutesEnum.USER_PAGE);
      }
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <RestaurantIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Restaurant Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            variant={location.pathname === "/" ? "outlined" : "text"}>
            Restaurants
          </Button>
          {user && userData ? (
            <Chip
              icon={<PersonIcon />}
              label={userData.name}
              onClick={handleUserClick}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  cursor: "pointer",
                },
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          ) : (
            <Button
              color="inherit"
              onClick={() => setSignInDialogOpen(true)}>
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
      <SignInDialog
        open={signInDialogOpen}
        onClose={() => setSignInDialogOpen(false)}
      />
    </AppBar>
  );
}

export default Navbar;
