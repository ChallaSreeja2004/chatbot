// src/ChatList.js

import React, { useState } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { useSignOut, useUserData } from '@nhost/react';
import { SettingsModal } from './SettingsModal';

// --- MUI IMPORTS ---
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
  Divider,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import { TbMessageChatbot } from 'react-icons/tb';

// --- GRAPHQL ---
const GET_CHATS_SUBSCRIPTION = gql`
  subscription GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
      title
    }
  }
`;
const INSERT_CHAT = gql`
  mutation InsertChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`;
const DELETE_CHAT = gql`
  mutation DeleteChat($id: uuid!) {
    delete_chats_by_pk(id: $id) {
      id
    }
  }
`;

export const ChatList = ({ onSelectChat, selectedChatId, onToggleDrawer }) => {
  const { loading, error, data } = useSubscription(GET_CHATS_SUBSCRIPTION);
  const [insertChat, { loading: isCreating }] = useMutation(INSERT_CHAT);
  const [deleteChat] = useMutation(DELETE_CHAT);
  const { signOut } = useSignOut();
  const user = useUserData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuChatId, setMenuChatId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  const handleMenuOpen = (event, chatId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuChatId(chatId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuChatId(null);
  };

  const handleDeleteClick = () => {
    setChatToDelete(menuChatId);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setChatToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (chatToDelete) {
      if (chatToDelete === selectedChatId) {
        onSelectChat(null);
      }
      await deleteChat({ variables: { id: chatToDelete } });
    }
    handleDialogClose();
  };

  const handleNewChat = async () => {
    try {
      const result = await insertChat();
      const newChatId = result.data.insert_chats_one.id;
      if (newChatId) {
        onSelectChat(newChatId);
      }
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  const handleSettingsClick = () => {
    setSettingsOpen(true);
    handleUserMenuClose();
  };
  const handleSignOutClick = () => {
    signOut();
    handleUserMenuClose();
  };

  if (error) {
    return <Box sx={{ p: 2 }}><Typography color="error">Error loading chats.</Typography></Box>;
  }

  const getInitials = (email = '') => email.substring(0, 2).toUpperCase();

  return (
    <Box sx={{ 
      p: { xs: 1, md: 1.5 }, 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden' 
    }}>
      
      <Box 
        onClick={() => onSelectChat(null)}
        sx={{ 
          p: 1, 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 1, md: 1.5 }, 
          flexShrink: 0,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ fontSize: '1.75rem', color: 'text.secondary', display: 'flex', mr:1.5 }}>
          <TbMessageChatbot />
        </Box>        
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Chatbot
        </Typography>
        
        {!isMobile && (
          <IconButton onClick={(e) => { e.stopPropagation(); onToggleDrawer(); }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleNewChat}
        disabled={isCreating}
        sx={{ 
          mb: { xs: 1.5, md: 2 }, 
          py: { xs: 1, md: 1.25 }, 
          borderColor: 'divider', 
          color: 'text.primary' 
        }}
      >
        New Chat
      </Button>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={56} sx={{ mb: 1, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 1, borderRadius: 2 }} />
            </>
          ) : (
            data?.chats.map((chat) => (
              <ListItem key={chat.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={chat.id === selectedChatId}
                  onClick={() => onSelectChat(chat.id)}
                  sx={{
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'action.hover' },
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiListItemText-secondary': { color: 'primary.contrastText', opacity: 0.7 },
                      '&:hover': { bgcolor: 'primary.main' }
                    },
                  }}
                >
                  <ListItemText
                    primary={chat.title || "New Conversation"}
                    primaryTypographyProps={{ 
                      sx: { fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } 
                    }}
                    secondary={new Date(chat.created_at).toLocaleDateString()}
                  />
                  <IconButton
                    aria-label="chat options"
                    onClick={(e) => handleMenuOpen(e, chat.id)}
                    sx={{
                      ml: 1,
                      color: chat.id === selectedChatId ? 'primary.contrastText' : 'inherit',
                      opacity: 0.7
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', flexShrink: 0 }}>
        <Divider sx={{ my: 1 }} />
        <Box 
          onClick={handleUserMenuOpen}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            cursor: 'pointer',
            borderRadius: 2,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Avatar sx={{ width: 32, height: 32, mr: 1.5, fontSize: '0.875rem', bgcolor: 'background.default', color: 'text.primary' }}>
            {getInitials(user?.email)}
          </Avatar>
          <Typography noWrap sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.displayName || user?.email}
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleSettingsClick}>
          <SettingsIcon sx={{ mr: 1.5, fontSize: '1.25rem' }} />
          Change Password
        </MenuItem>
        <MenuItem onClick={handleSignOutClick}>
          <LogoutIcon sx={{ mr: 1.5, fontSize: '1.25rem' }} />
          Sign Out
        </MenuItem>
      </Menu>
      
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>Delete Chat</MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Delete Conversation?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};