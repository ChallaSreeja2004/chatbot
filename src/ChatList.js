// src/ChatList.js
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
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

export const ChatList = ({ onSelectChat }) => {
  const { loading, error, data, refetch } = useQuery(GET_CHATS);
  const [insertChat, { loading: isCreating }] = useMutation(INSERT_CHAT, {
    onCompleted: () => refetch()
  });

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p>Error loading chats: {error.message}</p>;

  return (
    <div>
      <h3>Your Chats</h3>
      <button onClick={() => insertChat()} disabled={isCreating}>
        {isCreating ? 'Creating...' : '+ New Chat'}
      </button>
      <ul>
        {data?.chats.map((chat) => (
          <li key={chat.id} onClick={() => onSelectChat(chat.id)} style={{ cursor: 'pointer', margin: '5px 0' }}>
            Chat from {new Date(chat.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};