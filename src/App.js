// src/App.js
import { useAuthenticationStatus } from '@nhost/react';
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthenticationStatus();

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <Dashboard />;
}

export default App;