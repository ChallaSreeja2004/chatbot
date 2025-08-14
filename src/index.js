// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NhostProvider, useAuthenticationStatus } from '@nhost/react';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

import { nhost } from './nhost';
import App from './App';

const Main = () => {
  const { isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  const authLink = setContext((_, { headers }) => {
    const accessToken = nhost.auth.getAccessToken();
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      }
    };
  });

  const httpLink = createHttpLink({
    uri: nhost.graphql.httpUrl,
  });

  const wsLink = new WebSocketLink({
    uri: nhost.graphql.wsUrl,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => ({
        headers: {
          Authorization: `Bearer ${nhost.auth.getAccessToken()}`
        }
      })
    }
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <Main />
    </NhostProvider>
  </React.StrictMode>
);