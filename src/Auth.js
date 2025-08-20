// src/Auth.js

import React, { useState, useContext } from 'react';
import {
  useSignUpEmailPassword,
  useSignInEmailPassword,
  useProviderLink
} from '@nhost/react';
import { ThemeContext } from './App';

// --- MUI IMPORTS ---
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  useTheme,
  InputAdornment
} from '@mui/material';
import { keyframes } from '@emotion/react';

// --- ICONS ---
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { Sun, Moon } from 'react-feather';
import { TbMessageChatbot } from 'react-icons/tb';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Parent component - No changes needed
export const Auth = () => {
  const [showCheckEmail, setShowCheckEmail] = useState(false);

  if (showCheckEmail) {
    return <CheckEmailScreen />;
  }

  return (
    <AuthLayout>
      <AuthForm onSignUpSuccess={() => setShowCheckEmail(true)} />
    </AuthLayout>
  );
};

// Layout component - No changes needed
const AuthLayout = ({ children }) => {
  const { toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  return (
    <Box>
      <IconButton 
        onClick={toggleTheme} 
        title="Toggle theme"
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16,
          zIndex: 1
        }}
      >
        {theme.palette.mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}      
      </IconButton>
      {children}
    </Box>
  );
};


const AuthForm = ({ onSignUpSuccess }) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const [customError, setCustomError] = useState(null);

  const { signUpEmailPassword, isLoading: isSigningUp } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: isSigningIn } = useSignInEmailPassword();
  const providerUrls = useProviderLink();

  const handleEmailChange = (e) => {
    setCustomError(null);
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setCustomError(null);
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCustomError(null);
    const cleanEmail = email.trim();

    if (isSignUpMode) {
      const result = await signUpEmailPassword(cleanEmail, password);
      if (result.needsEmailVerification) {
        onSignUpSuccess();
      } else if (result.isSuccess) {
        onSignUpSuccess();
      } else if (result.isError) {
        setCustomError(result.error.message);
      }
    } else {
      const result = await signInEmailPassword(cleanEmail, password);
      if (result.needsEmailVerification) {
        setCustomError('Please verify your email to sign in. Check your inbox for a verification link.');
      } else if (result.isError) {
        setCustomError(result.error.message || 'An unknown error occurred.');
      }
    }
  };

  const isLoading = isSigningIn || isSigningUp;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }} >
            <Box sx={{ fontSize: '2.5rem', color: 'text.primary', display: 'flex' }} > <TbMessageChatbot /> </Box>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}> ChatBot </Typography>
          </Box>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {isSignUpMode ? 'Create an account to get started.' : 'Welcome back! Please sign in.'}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2,
            animation: `${fadeIn} 0.7s ease-out`, border: '1px solid', borderColor: 'divider',
            bgcolor: 'background.paper', borderRadius: 3,
            boxShadow: theme.palette.mode === 'light' ? '0px 4px 20px rgba(0, 0, 0, 0.05)' : 'none'
          }}
        >
          {/* Social Logins */}
          <Button variant="outlined" startIcon={<GoogleIcon />} href={providerUrls.google} sx={{ borderColor: 'divider' }}>
            Continue with Google
          </Button>
          <Button variant="outlined" startIcon={<GitHubIcon />} href={providerUrls.github} sx={{ borderColor: 'divider' }}>
            Continue with Github
          </Button>
          <Divider> <Typography variant="caption" sx={{ color: 'text.secondary' }}> or </Typography> </Divider>

          {/* Form Fields */}
          <TextField label="E-mail" variant="filled" type="email" value={email} onChange={handleEmailChange} required fullWidth />
          <TextField
            label="Password" variant="filled" type={showPassword ? 'text' : 'password'}
            value={password} onChange={handlePasswordChange} required fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={(e) => e.preventDefault()} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Simplified Error Display */}
          {customError && (
            <Alert severity="error">{customError}</Alert>
          )}

          <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading} sx={{ mt: 1, py: 1.5 }}>
            {isLoading ? <CircularProgress size={26} color="inherit" /> : isSignUpMode ? 'Create Account' : 'Sign In'}
          </Button>

          {/* Toggle Form Mode */}
          <Typography sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
            {isSignUpMode ? 'Already have an account? ' : "Don't have an account? "}
            <Link component="button" type="button" onClick={() => { setIsSignUpMode(!isSignUpMode); setCustomError(null); }} sx={{ fontWeight: 'bold' }}>
              {isSignUpMode ? 'Sign In' : 'Create an account'}
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};


// CheckEmailScreen component - MODIFIED
const CheckEmailScreen = () => {
  const theme = useTheme();
  return (
    <AuthLayout>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
        <Box sx={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* --- THIS IS THE ADDED HEADER --- */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }} >
              <Box sx={{ fontSize: '2.5rem', color: 'text.primary', display: 'flex' }} > <TbMessageChatbot /> </Box>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}> ChatBot </Typography>
            </Box>
          </Box>
          {/* ----------------------------- */}

          <Box sx={{ position: 'relative', width: '100%' }}>
            <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 1.5, borderRadius: '50%', border: '1px solid', borderColor: 'divider', zIndex: 1, display: 'flex' }}>
              <MarkEmailReadIcon sx={{ color: 'text.secondary' }} />
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 4, textAlign: 'center', animation: `${fadeIn} 0.5s ease-out`,
                border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
                borderRadius: 3, // Added for consistency
                mt: 5, boxShadow: theme.palette.mode === 'light' ? '0px 4px 20px rgba(0, 0, 0, 0.05)' : 'none'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 1, pt: 2 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Check Your Email
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  We've sent a verification link to your email. Please click the
                  link to complete the signup process.
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => window.location.reload()} fullWidth>
                Back to Sign In
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};