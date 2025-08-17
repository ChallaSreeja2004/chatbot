// src/Dashboard.js

import React, { useState, useContext } from 'react';
import { ChatList } from './ChatList';
import { MessageView } from './MessageView';
import { WelcomeScreen } from './WelcomeScreen';
import { ThemeContext } from './App';

// --- MUI IMPORTS ---
import { Box, Typography, Divider, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';

export const Dashboard = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [activeChatTitle, setActiveChatTitle] = useState('AI Assistant');

  const { toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      <Box
        sx={{
          width: { xs: '280px', md: '320px' },
          flexShrink: 0,
          bgcolor: 'background.paper', 
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {activeChatTitle}
          </Typography>
          {/* Using SettingsIcon as per your last screenshot reference */}
          <IconButton title="Settings">
            <SettingsIcon />
          </IconButton>
        </Box>
        <Divider sx={{ flexShrink: 0 }} />
        
        {/* --- THIS IS THE CRITICAL FIX --- */}
        {/* We add flexbox centering properties to this container. */}
        <Box sx={{ 
            flexGrow: 1, 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {selectedChatId ? (
            <MessageView 
              chatId={selectedChatId} 
              key={selectedChatId} 
              onTitleChange={(title) => setActiveChatTitle(title)}
            />
          ) : (
            <WelcomeScreen />
          )}
        </Box>
      </Box>
    </Box>
  );
};