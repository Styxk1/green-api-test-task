import { useState } from 'react';
import { ChatPage } from './pages/ChatPage';
import { LoginPage } from './pages/LoginPage';
import type { Credentials } from './types/greenApi';
import { loadCredentials, saveCredentials } from './utils/credentialsStorage';

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(loadCredentials);

  const handleLogin = (newCredentials: Credentials) => {
    saveCredentials(newCredentials);
    setCredentials(newCredentials);
  };

  return credentials ? <ChatPage credentials={credentials} /> : <LoginPage onLogin={handleLogin} />;
}

export default App;
