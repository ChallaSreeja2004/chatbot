// src/MessageBubble.js

import { Paper, Typography, Avatar, Box, useTheme } from '@mui/material';
import { FiUser } from "react-icons/fi"; 
import { TbMessageChatbot } from 'react-icons/tb';

export const MessageBubble = ({ msg }) => {
  const theme = useTheme();
  const isUser = msg.role === 'user';
  const isDarkMode = theme.palette.mode === 'dark';

  const botBubbleStyle = {
    bgcolor: 'background.paper',
    color: 'text.primary',
    border: isDarkMode ? 'none' : `1px solid ${theme.palette.divider}`,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: { xs: 1.5, md: 2 },
      }}
    >
      {isUser ? (
        <Avatar sx={{ 
          bgcolor: 'accent.main',
          color: 'accent.contrastText',
          width: 40, 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <FiUser size={22} />
        </Avatar>
      ) : (
        <Box sx={{ 
          width: 40, 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '1.75rem', 
          color: 'text.secondary' 
        }}>
          <TbMessageChatbot />
        </Box>
      )}
      
      <Paper
        elevation={0}
        sx={{
          p: { xs: '10px 14px', md: '12px 16px' },
          maxWidth: '80%',
          position: 'relative',
          bgcolor: isUser ? 'accent.main' : botBubbleStyle.bgcolor,
          color: isUser ? 'accent.contrastText' : botBubbleStyle.color,
          border: isUser ? 'none' : botBubbleStyle.border,
          borderRadius: '12px',
          borderBottomRightRadius: isUser ? '4px' : '12px',
          borderBottomLeftRadius: isUser ? '12px' : '4px',
        }}
      >
        <Box sx={{ pb: 1, pr: 6 }}> 
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {msg.content}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 14,
            color: isUser ? theme.palette.accent.contrastText : theme.palette.text.secondary,
            opacity: isUser ? 0.7 : 1,
            fontSize: '0.7rem',
          }}
        >
          {new Date(msg.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
}