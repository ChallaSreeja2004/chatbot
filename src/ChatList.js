// src/ChatList.js
import { gql, useSubscription, useMutation } from '@apollo/client'; // CHANGED: useQuery is now useSubscription

// CHANGED: The operation is now a 'subscription' for real-time updates.
const GET_CHATS_SUBSCRIPTION = gql`
  subscription GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
      title
    }
  }
`;

// This mutation stays the same.
const INSERT_CHAT = gql`
  mutation InsertChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`;

export const ChatList = ({ onSelectChat }) => {
  // CHANGED: The hook is now useSubscription.
  const { loading, error, data } = useSubscription(GET_CHATS_SUBSCRIPTION);
  
  // CHANGED: The 'refetchQueries' option is removed because the subscription handles updates.
  const [insertChat, { loading: isCreating }] = useMutation(INSERT_CHAT);

  const handleNewChat = () => {
    insertChat();
  };

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p>Error loading chats: {error.message}</p>;

  return (
    <div>
      <h3>Your Chats</h3>
      <button onClick={handleNewChat} disabled={isCreating}>
        {isCreating ? 'Creating...' : '+ New Chat'}
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            style={{
              cursor: 'pointer',
              margin: '5px 0',
              padding: '8px',
              borderRadius: '4px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {/* This display logic remains the same and will now update in real-time. */}
            {chat.title || `Chat from ${new Date(chat.created_at).toLocaleString()}`}
          </li>
        ))}
      </ul>
    </div>
  );
};