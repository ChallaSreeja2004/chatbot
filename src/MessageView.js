// src/MessageView.js
import { useState, useEffect, useRef } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';

const GET_MESSAGES_SUBSCRIPTION = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
    }
  }
`;

const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, role: "user", content: $content }) {
      id
    }
  }
`;

const SEND_MESSAGE_ACTION = gql`
  mutation SendMessageAction($chat_id: uuid!, $content: String!) {
    sendMessage(message: { chat_id: $chat_id, content: $content }) {
      reply
    }
  }
`;

export const MessageView = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // This subscription is the single source of truth for our UI
  const { data, loading, error } = useSubscription(GET_MESSAGES_SUBSCRIPTION, {
    variables: { chat_id: chatId },
  });

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessageAction, { loading: isBotReplying }] = useMutation(SEND_MESSAGE_ACTION);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isBotReplying) return;

    setMessage(''); // Clear the input immediately

    try {
      // Step 1: Save the user's message. The subscription will see this and update the UI.
      await insertUserMessage({
        variables: {
          chat_id: chatId,
          content: currentMessage
        },
      });

      // Step 2: Call the action. The subscription will see the bot's reply and update the UI again.
      await sendMessageAction({
        variables: {
          chat_id: chatId,
          content: currentMessage
        },
      });
    } catch (err) {
      // THIS IS THE MOST IMPORTANT PART: We catch the error and handle it gracefully.
      console.error("Transaction failed:", err);
      // We restore the message in the input box so the user knows it failed to send.
      setMessage(currentMessage);
    }
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
        {data?.messages.map((msg) => (
          <p key={msg.id} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{
              backgroundColor: msg.role === 'user' ? '#007bff' : '#e9e9eb',
              color: msg.role === 'user' ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: '15px',
              display: 'inline-block',
              maxWidth: '70%'
            }}>
              {msg.content}
            </span>
          </p>
        ))}
        {isBotReplying && <p style={{ textAlign: 'left' }}><i>Bot is typing...</i></p>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isBotReplying}
          style={{ flex: 1, padding: '10px' }}
        />
        <button type="submit" disabled={isBotReplying} style={{ padding: '10px' }}>Send</button>
      </form>
    </div>
  );
};