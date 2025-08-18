// src/Dashboard.js

import React, { useState, useContext } from 'react'; // <-- Import useContext
import { ChatList } from './ChatList';
import { MessageView } from './MessageView';
import { WelcomeScreen } from './WelcomeScreen';
import { ThemeContext } from './App'; // <-- Import ThemeContext

// --- MUI IMPORTS ---
import { Box, useTheme, useMediaQuery, CssBaseline, IconButton } from '@mui/material'; // <-- Import IconButton
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { Sun, Moon } from 'react-feather';

const drawerWidth = 320;

// --- STYLED COMPONENT FOR THE COLLAPSIBLE DRAWER ---
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  borderRight: `1px solid ${theme.palette.divider}`,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
  borderRight: 'none',
});

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export const Dashboard = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { toggleTheme } = useContext(ThemeContext); // <-- Get toggle function from context

  const handleMobileDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDesktopDrawerToggle = () => setDesktopDrawerOpen(!desktopDrawerOpen);

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <ChatList 
      onSelectChat={handleChatSelect} 
      selectedChatId={selectedChatId} 
      onToggleDrawer={handleDesktopDrawerToggle}
    />
  );

  const mainContent = (
    <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* --- GLOBAL THEME TOGGLE BUTTON --- */}
      <IconButton 
        onClick={toggleTheme} 
        title="Toggle theme"
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 24, 
          zIndex: (theme) => theme.zIndex.drawer + 1 // Ensure it's above other content
        }}
      >
{theme.palette.mode === 'dark' ? <Sun size={25} /> : <Moon size={25} />}      
</IconButton>
      
      {selectedChatId ? (
        <MessageView 
          chatId={selectedChatId} 
          key={selectedChatId}
          onMenuClick={handleMobileDrawerToggle}
          onToggleDrawer={handleDesktopDrawerToggle}
          isDrawerOpen={desktopDrawerOpen}
        />
      ) : (
        <WelcomeScreen 
          onMenuClick={handleMobileDrawerToggle}
          onToggleDrawer={handleDesktopDrawerToggle}
          isDrawerOpen={desktopDrawerOpen}
        />
      )}
    </Box>
  );

  // --- MOBILE VIEW ---
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawerContent}
        </MuiDrawer>
        {mainContent}
      </Box>
    );
  }

  // --- DESKTOP VIEW ---
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <StyledDrawer variant="permanent" open={desktopDrawerOpen}>
        {drawerContent}
      </StyledDrawer>
      {mainContent}
    </Box>
  );
};