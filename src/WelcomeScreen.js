// src/WelcomeScreen.js
import React from 'react';
import { Box, Typography } from '@mui/material';

// --- 1. CHANGE THE IMPORT ---
// We now import `TbMessageChatbot` from the "tb" (Tabler Icons) section of the library.
import { TbMessageChatbot } from "react-icons/tb";

export const WelcomeScreen = () => {
  return (
    <Box 
      sx={{ 
        m: 'auto', 
        textAlign: 'center', 
        color: 'text.secondary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ fontSize: '3.5rem', color: 'text.primary', display: 'flex' }}>
      <TbMessageChatbot />
    </Box>
      
      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        Welcome to your AI Assistant
      </Typography>
      
      <Typography>
        Select a conversation from the sidebar or start a new one to begin.
      </Typography>
    </Box>
  );
};