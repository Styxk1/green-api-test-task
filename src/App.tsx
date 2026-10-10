import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import type { Credentials } from './types/greenApi';
import { loadCredentials, saveCredentials } from './utils/credentialsStorage';

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(loadCredentials);

  const handleLogin = (newCredentials: Credentials) => {
    saveCredentials(newCredentials);
    setCredentials(newCredentials);
  };

  return credentials ? <h1>Чаты</h1> : <LoginPage onLogin={handleLogin} />;
}

export default App;
