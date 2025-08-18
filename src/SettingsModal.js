// src/SettingsModal.js

import React, { useState } from 'react';
import { useChangePassword } from '@nhost/react'; // <-- We only need this hook now

// --- MUI IMPORTS ---
import {
  Box, Button, Dialog, DialogTitle, DialogContent, IconButton, TextField,
  CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// --- CHANGE PASSWORD COMPONENT ---
const ChangePasswordForm = ({ onClose }) => {
  const { changePassword, isLoading, isSuccess, isError, error } = useChangePassword();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }
    await changePassword(newPassword);
  };

  if (isSuccess) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="success">Password changed successfully!</Alert>
        <Button onClick={onClose} sx={{ mt: 2 }} fullWidth variant="contained">
          Done
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        fullWidth
        autoFocus
      />
      <TextField
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!localError}
        helperText={localError}
        required
        fullWidth
      />
      {isError && <Alert severity="error">{error?.message}</Alert>}
      <Button type="submit" variant="contained" disabled={isLoading} fullWidth sx={{ py: 1.5 }}>
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
      </Button>
    </Box>
  );
};

// --- MAIN MODAL COMPONENT (Simplified) ---
export const SettingsModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        Change Password
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <ChangePasswordForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};