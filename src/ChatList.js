// src/ChatList.js

import React from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { useSignOut, useUserData } from '@nhost/react';

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
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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

export const ChatList = ({ onSelectChat, selectedChatId, onToggleDrawer }) => {
  const { loading, error, data } = useSubscription(GET_CHATS_SUBSCRIPTION);
  const [insertChat, { loading: isCreating }] = useMutation(INSERT_CHAT);
  const { signOut } = useSignOut();
  const user = useUserData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.5 }, flexShrink: 0 }}>
        <Box sx={{ fontSize: '1.75rem', color: 'text.secondary', display: 'flex', mr:1.5 }}>
          <TbMessageChatbot />
        </Box>        
        <Typography variant="h6">
          Chatbot
        </Typography>
        
        {!isMobile && (
          <IconButton onClick={onToggleDrawer} sx={{ ml: 'auto' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => insertChat()}
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
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiListItemText-secondary': {
                        color: 'primary.contrastText',
                        opacity: 0.7,
                      },
                      '&:hover': {
                        bgcolor: 'primary.main',
                      }
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
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', flexShrink: 0 }}>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1.5, fontSize: '0.875rem', bgcolor: 'background.default', color: 'text.primary' }}>
            {getInitials(user?.email)}
          </Avatar>
          <Typography noWrap sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.displayName || user?.email}
          </Typography>
          
          <IconButton onClick={() => signOut()} title="Sign Out">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};