// src/MessageView.js

import React, { useState, useEffect, useRef, useContext } from 'react';
import { gql, useSubscription, useMutation, useQuery } from '@apollo/client';
import { MessageBubble } from './MessageBubble';
import { ThemeContext } from './App';

// --- MUI IMPORTS ---
import { Box, IconButton, CircularProgress, InputBase, Paper, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- GRAPHQL ---
const GET_CHAT_TITLE = gql`
  query GetChatTitle($id: uuid!) {
    chats_by_pk(id: $id) {
      id
      title
    }
  }
`;
const GET_MESSAGES_SUBSCRIPTION = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id, content, role, created_at
    }
  }
`;
const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, role: "user", content: $content }) { id }
  }
`;
const SEND_MESSAGE_ACTION = gql`
  mutation SendMessageAction($chat_id: uuid!, $content: String!) {
    sendMessage(message: { chat_id: $chat_id, content: $content }) { reply }
  }
`;

// --- THEMED TYPING INDICATOR ---
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
`;
const TypingDot = styled(Box)(({ theme }) => ({
  width: '8px',
  height: '8px',
  backgroundColor: theme.palette.text.secondary,
  borderRadius: '50%',
  margin: '0 3px',
  animation: `${bounce} 1.2s infinite ease-in-out`,
}));
const TypingIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: '58px' }}>
    <TypingDot />
    <TypingDot sx={{ animationDelay: '-0.2s' }} />
    <TypingDot sx={{ animationDelay: '-0.4s' }} />
  </Box>
);

// --- MAIN COMPONENT ---
export const MessageView = ({ chatId, onGoBack }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const { toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: chatData } = useQuery(GET_CHAT_TITLE, { variables: { id: chatId } });
  const chatTitle = chatData?.chats_by_pk?.title || "New Conversation";

  const { data, loading, error } = useSubscription(GET_MESSAGES_SUBSCRIPTION, { variables: { chat_id: chatId } });
  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessageAction, { loading: isBotReplying }] = useMutation(SEND_MESSAGE_ACTION);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [data, isBotReplying]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isBotReplying || !chatId) return;
    setMessage('');
    try {
      await insertUserMessage({ variables: { chat_id: chatId, content: currentMessage } });
      await sendMessageAction({ variables: { chat_id: chatId, content: currentMessage } });
    } catch (err) {
      console.error('Transaction failed:', err);
      setMessage(currentMessage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (loading) return <Box sx={{ m: 'auto' }}><CircularProgress color="inherit" /></Box>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {isMobile && (
          <IconButton onClick={onGoBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }} noWrap>
          {chatTitle}
        </Typography>
        <IconButton onClick={toggleTheme} title="Toggle theme">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1 }} />
        {data?.messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isBotReplying && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ px: 3, pb: 3, flexShrink: 0 }}>
        <Paper 
          component="form" 
          elevation={0}
          onSubmit={handleSubmit} 
          sx={{ 
            p: '4px 8px', display: 'flex', alignItems: 'center',
            borderRadius: '12px', bgcolor: 'background.paper',
            border: '1px solid', borderColor: 'divider',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, color: 'text.primary' }}
            placeholder="Message your AI Assistant..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBotReplying}
            multiline
            maxRows={5}
          />
          <IconButton type="submit" color="inherit" disabled={!message.trim() || isBotReplying}>
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};