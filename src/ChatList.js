// src/ChatList.js
import { gql, useQuery, useMutation } from '@apollo/client';
import { useUserData } from '@nhost/react'; // ADDED: To get the current user's ID

// CHANGED: Added the 'title' field to the query
const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
      title
    }
  }
`;

// CHANGED: Modified mutation to accept user_id
const INSERT_CHAT = gql`
  mutation InsertChat($user_id: uuid!) {
    insert_chats_one(object: { user_id: $user_id }) {
      id
    }
  }
`;

export const ChatList = ({ onSelectChat }) => {
  const user = useUserData(); // ADDED: Hook to get the user object
  const { loading, error, data } = useQuery(GET_CHATS); // REMOVED: refetch is handled automatically now
  const [insertChat, { loading: isCreating }] = useMutation(INSERT_CHAT, {
    // This is a more standard way to refetch
    refetchQueries: [{ query: GET_CHATS }],
  });

  // ADDED: New handler function to include the user's ID
  const handleNewChat = () => {
    if (user?.id) {
      insertChat({ variables: { user_id: user.id } });
    }
  };

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p>Error loading chats: {error.message}</p>;

  return (
    <div>
      <h3>Your Chats</h3>
      {/* CHANGED: onClick now calls the new handler function */}
      <button onClick={handleNewChat} disabled={isCreating}>
        {isCreating ? 'Creating...' : '+ New Chat'}
      </button>
      {/* CHANGED: Styling for the list */}
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
            {/* CHANGED: Logic to display title or fallback to timestamp */}
            {chat.title || `Chat from ${new Date(chat.created_at).toLocaleString()}`}
          </li>
        ))}
      </ul>
    </div>
  );
};