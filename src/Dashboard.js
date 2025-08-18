// src/Dashboard.js

import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { MessageView } from './MessageView';
import { WelcomeScreen } from './WelcomeScreen';

// --- MUI IMPORTS ---
import { Box, useTheme, useMediaQuery } from '@mui/material';

export const Dashboard = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));  // --- RENDER A DIFFERENT LAYOUT FOR MOBILE ---
  if (isMobile) {
    return (
      <Box sx={{ height: '100vh', overflow: 'hidden' }}>
        {selectedChatId ? (
          // On mobile, if a chat is selected, ONLY render the MessageView.
          <MessageView 
            chatId={selectedChatId} 
            key={selectedChatId}
            onGoBack={() => setSelectedChatId(null)}
          />
        ) : (
          // Otherwise, ONLY render the ChatList.
          <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
        )}
      </Box>
    );
  }

  // --- RENDER THE DESKTOP LAYOUT ---
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      
      {/* DESKTOP SIDEBAR */}
      <Box
        sx={{
          width: '320px',
          flexShrink: 0,
          bgcolor: 'background.paper', 
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      </Box>

      {/* DESKTOP MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {selectedChatId ? (
          <MessageView 
            chatId={selectedChatId} 
            key={selectedChatId}
            onGoBack={() => setSelectedChatId(null)}
          />
        ) : (
          <WelcomeScreen />
        )}
      </Box>
    </Box>
  );
};