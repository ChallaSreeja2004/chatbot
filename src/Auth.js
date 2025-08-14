// src/Auth.js
import { useState } from 'react';
import { useSignUpEmailPassword, useSignInEmailPassword } from '@nhost/react';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUpEmailPassword, isLoading: isSigningUp, error: signUpError } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: isSigningIn, error: signInError } = useSignInEmailPassword();

  const handleAuth = (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.innerText === "Sign In") {
      signInEmailPassword(email, password);
    } else {
      signUpEmailPassword(email, password);
    }
  };

  return (
    <div>
      <h2>My Secure Chatbot</h2>
      <form onSubmit={handleAuth}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={isSigningIn}>Sign In</button>
        <button type="submit" disabled={isSigningUp}>Sign Up</button>
      </form>
      {signInError && <p style={{ color: 'red' }}>{signInError.message}</p>}
      {signUpError && <p style={{ color: 'red' }}>{signUpError.message}</p>}
    </div>
  );
};