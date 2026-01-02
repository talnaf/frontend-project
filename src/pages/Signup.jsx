import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { registerUser } from "../firebase/authentication/emailAuth";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      console.log("Signup data:", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      registerUser(formData.name, formData.email, formData.password, formData.role, setLoading, navigate);

    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <PersonAddIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1">
            Sign Up
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account created successfully! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            margin="normal"
            autoComplete="name"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            margin="normal"
            autoComplete="email"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            margin="normal"
            helperText="Must be at least 6 characters"
            autoComplete="new-password"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
            margin="normal"
            autoComplete="new-password"
            disabled={loading}
          />

          <FormControl component="fieldset" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            <FormLabel component="legend">Account Type</FormLabel>
            <RadioGroup
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}>
              <FormControlLabel
                value="user"
                control={<Radio />}
                label="User - Browse and review restaurants"
              />
              <FormControlLabel
                value="manager"
                control={<Radio />}
                label="Restaurant Manager - Manage restaurant listings"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading || success}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
              size="large"
              fullWidth
              disabled={loading}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;
