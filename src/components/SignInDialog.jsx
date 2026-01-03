import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  IconButton,
  Typography,
  Link,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Close as CloseIcon, Google as GoogleIcon } from "@mui/icons-material";
import { loginUserWithEmailAndPassword } from "../firebase/authentication/emailAuth";
import { useNavigate } from "react-router-dom";
import { signInUserWithGoogle, completeGoogleSignUp } from "../firebase/authentication/googleAuth";
import { forgotPassword } from "../firebase/authentication/passwordAuth";

function SignInDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");
  const navigate = useNavigate();

  // Reset all states when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({ email: "", password: "" });
      setResetEmail("");
      setError("");
      setShowForgotPassword(false);
      setResetSuccess(false);
      setShowRoleSelection(false);
      setPendingGoogleUser(null);
      setSelectedRole("user");
      setLoading(false);
    }
  }, [open]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      loginUserWithEmailAndPassword(formData.email, formData.password, navigate);

      console.log("Sign in data:", {
        email: formData.email,
      });

      // On success, close dialog and reset form
      setFormData({ email: "", password: "" });
      onClose();
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ email: "", password: "" });
      setResetEmail("");
      setError("");
      setShowForgotPassword(false);
      setResetSuccess(false);
      setShowRoleSelection(false);
      setPendingGoogleUser(null);
      setSelectedRole("user");
      onClose();
    }
  };

  const handleSignUp = () => {
    handleClose();
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    setError("");
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setError("");
    setResetEmail("");
    setResetSuccess(false);
    setShowForgotPassword(false);
    setShowRoleSelection(false);
    setPendingGoogleUser(null);
    setSelectedRole("user");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Validation
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement password reset functionality
      console.log("Password reset for:", resetEmail);
      forgotPassword(resetEmail, navigate);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResetSuccess(true);
      setError("");
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    let userFound = true;
    try {
      await signInUserWithGoogle(navigate, (userData) => {
        console.log("signInUserWithGoogle - userData:",userData)
        // User doesn't exist, show role selection
        userFound = false;
        setPendingGoogleUser(userData);
        setShowRoleSelection(true);
        setLoading(false);
      });
      // Only close the dialog if user was found (existing user signed in)
      if (userFound) {
        handleClose();
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google. Please try again.");
      setLoading(false);
    }
  };

  const handleCompleteGoogleSignUp = async () => {
    if (!pendingGoogleUser) return;

    setLoading(true);
    setError("");
    try {
      await completeGoogleSignUp(pendingGoogleUser, selectedRole, navigate);
      // Successfully created account, close dialog
      handleClose();
    } catch (error) {
      console.error("Failed to complete Google sign-up:", error);
      setError("Failed to create your account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {showRoleSelection ? "Select Account Type" : showForgotPassword ? "Reset Password" : "Sign In"}
          <IconButton onClick={handleClose} disabled={loading} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Box
        component="form"
        onSubmit={showForgotPassword ? handlePasswordReset : handleSignIn}
        noValidate>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {resetSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset email sent! Please check your inbox.
            </Alert>
          )}
          {showRoleSelection ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Welcome! Please select your account type to complete the sign-up process.
              </Typography>
              <FormControl component="fieldset" fullWidth disabled={loading}>
                <FormLabel component="legend">Account Type</FormLabel>
                <RadioGroup
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}>
                  <FormControlLabel
                    value="user"
                    control={<Radio />}
                    label="User - Browse and review restaurants"
                  />
                  <FormControlLabel
                    value="restaurantOwner"
                    control={<Radio />}
                    label="Restaurant Owner - Manage restaurant listings"
                  />
                </RadioGroup>
              </FormControl>
            </>
          ) : showForgotPassword ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setError("");
                }}
                required
                margin="normal"
                autoComplete="email"
                disabled={loading}
                autoFocus
              />
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignIn}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  mb: 2,
                  textTransform: "none",
                  borderColor: "#dadce0",
                  color: "#3c4043",
                  "&:hover": {
                    borderColor: "#d2e3fc",
                    backgroundColor: "#f8f9fa",
                  },
                }}>
                Sign in with Google
              </Button>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
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
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                margin="normal"
                autoComplete="current-password"
                disabled={loading}
              />
              <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  sx={{ textDecoration: "none", cursor: "pointer" }}>
                  Forgot Password?
                </Link>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", gap: 1, px: 3, pb: 2 }}>
          {showRoleSelection ? (
            <>
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button onClick={handleBackToSignIn} disabled={loading} sx={{ flex: 1 }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCompleteGoogleSignUp}
                  disabled={loading}
                  sx={{ flex: 1 }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                  {loading ? "Creating Account..." : "Continue"}
                </Button>
              </Box>
            </>
          ) : showForgotPassword ? (
            <>
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button onClick={handleBackToSignIn} disabled={loading} sx={{ flex: 1 }}>
                  Back to Sign In
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || resetSuccess}
                  sx={{ flex: 1 }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                  {loading ? "Sending..." : "Reset Password"}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button onClick={handleClose} disabled={loading} sx={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  justifyContent: "center",
                }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?
                </Typography>
                <Button size="small" onClick={handleSignUp} disabled={loading}>
                  Sign Up
                </Button>
              </Box>
            </>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SignInDialog;
