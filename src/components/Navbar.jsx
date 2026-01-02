import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Restaurant as RestaurantIcon } from "@mui/icons-material";
import SignInDialog from "./SignInDialog";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <RestaurantIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Restaurant Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            variant={location.pathname === "/" ? "outlined" : "text"}>
            Restaurants
          </Button>
          <Button
            color="inherit"
            onClick={() => setSignInDialogOpen(true)}>
            Sign In
          </Button>
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
