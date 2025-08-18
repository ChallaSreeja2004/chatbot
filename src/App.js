// src/App.js

import React, { useState, useMemo, createContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';

// --- NHOST & APOLLO IMPORTS ---
import { useAuthenticationStatus } from '@nhost/react';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { nhost } from './nhost';

// --- MUI IMPORTS ---
import { Box, CircularProgress, CssBaseline, GlobalStyles } from '@mui/material';

// --- COMPONENT IMPORTS ---
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';

export const ThemeContext = createContext({ toggleTheme: () => {} });

// --- APOLLO CLIENT SETUP ---
const getApolloClient = () => {
  const authLink = setContext((_, { headers }) => {
    const accessToken = nhost.auth.getAccessToken();
    return { headers: { ...headers, authorization: accessToken ? `Bearer ${accessToken}` : '' } };
  });
  const httpLink = createHttpLink({ uri: nhost.graphql.httpUrl });
  const wsLink = new WebSocketLink({
    uri: nhost.graphql.wsUrl,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => ({ headers: { Authorization: `Bearer ${nhost.auth.getAccessToken()}` } }),
    },
  });
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink)
  );
  return new ApolloClient({ link: splitLink, cache: new InMemoryCache() });
};

const AppContent = () => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return (
      <ApolloProvider client={getApolloClient()}>
        <Dashboard />
      </ApolloProvider>
    );
  }

  return <Auth />;
};

const globalStyles = (theme) => ({
  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.text.secondary,
    },
  },
  // --- THE DEFINITIVE AUTOFILL FIX ---
  'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active': {
    // 1. Use the box-shadow trick to cover the background
    WebkitBoxShadow: `0 0 0 30px ${theme.palette.background.paper} inset !important`,
    
    // 2. Force the text color to match the theme
    WebkitTextFillColor: `${theme.palette.text.primary} !important`,
    
    // 3. Force a very long transition to delay the browser's style changes
    transition: 'background-color 5000s ease-in-out 0s !important',
    
    // 4. Ensure the caret color also matches the theme
    caretColor: `${theme.palette.text.primary} !important`,
    
    borderRadius: 'inherit',
  },
});
function App() {
  const [mode, setMode] = useState('dark');
  const themeToggler = {
    toggleTheme: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
  };
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={themeToggler}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles(theme)} />
        <AppContent />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;