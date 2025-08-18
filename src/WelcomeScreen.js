// src/WelcomeScreen.js

import React from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TbMessageChatbot } from 'react-icons/tb';

export const WelcomeScreen = ({ 
  onMenuClick, // For mobile
  onToggleDrawer = () => {}, // For desktop
  isDrawerOpen = false // For desktop
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      
      {/* This header is only for the menu button */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <IconButton onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}
        {!isMobile && !isDrawerOpen && (
          <IconButton onClick={onToggleDrawer}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ fontSize: '3rem', color: 'text.secondary', mb: 2 }}>
        <TbMessageChatbot />
      </Box>
      <Typography variant="h5" component="h1" gutterBottom>
        AI Assistant
      </Typography>
      <Typography color="text.secondary">
        Select a conversation or start a new one to begin.
      </Typography>
    </Box>
  );
};