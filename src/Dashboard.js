import { useState } from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { ChatList } from './ChatList';
import { MessageView } from './MessageView';

export const Dashboard = () => {
  const { signOut } = useSignOut();
  const user = useUserData();
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleSelectChat = (chatId) => {
    if (chatId) {
      setSelectedChatId(String(chatId)); // ensure always string
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '80vw',
        margin: 'auto'
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px'
        }}
      >
        <h2>Dashboard</h2>
        <div>
          <span>Welcome, {user?.email}!</span>
          <button onClick={signOut} style={{ marginLeft: '10px' }}>
            Sign Out
          </button>
        </div>
      </header>
      <hr />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            flex: '0 0 300px',
            borderRight: '1px solid #ccc',
            paddingRight: '10px',
            overflowY: 'auto'
          }}
        >
          <ChatList onSelectChat={handleSelectChat} />
        </div>
        <div style={{ flex: 1, paddingLeft: '10px' }}>
          {selectedChatId && typeof selectedChatId === 'string' ? (
            <MessageView chatId={selectedChatId} />
          ) : (
            <h3>Select a chat to start messaging</h3>
          )}
        </div>
      </div>
    </div>
  );
};
