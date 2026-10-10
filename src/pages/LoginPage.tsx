import { useState, type SubmitEvent } from 'react';
import { ApiError, getStateInstance } from '../api/greenApi';
import type { Credentials, StateInstance } from '../types/greenApi';
import styles from './LoginPage.module.css';

const STATE_ERRORS: Record<Exclude<StateInstance, 'authorized'>, string> = {
  notAuthorized: 'Инстанс не авторизован в MAX. Авторизуйте его в личном кабинете GREEN-API',
  blocked: 'Аккаунт MAX заблокирован',
  starting: 'Инстанс запускается, попробуйте через пару минут',
  suspended: 'Аккаунт MAX временно ограничен',
  pendingPassword: 'Требуется пароль от аккаунта MAX. Завершите авторизацию в личном кабинете',
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.status === 401 || error.status === 403
      ? 'Неверный idInstance или apiTokenInstance'
      : `Ошибка GREEN-API (код ${error.status})`;
  }
  if (error instanceof TypeError) {
    return 'Не удалось подключиться к GREEN-API. Проверьте интернет';
  }
  return 'Что-то пошло не так, попробуйте ещё раз';
};

interface Props {
  onLogin: (credentials: Credentials) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFilled = idInstance.trim() !== '' && apiTokenInstance.trim() !== '';

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const credentials: Credentials = {
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      };
      const { stateInstance } = await getStateInstance(credentials);

      if (stateInstance === 'authorized') {
        onLogin(credentials);
      } else {
        setError(STATE_ERRORS[stateInstance] ?? `Неизвестный статус инстанса: ${stateInstance}`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.glow} aria-hidden="true" />
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Вход в GREEN-API</h1>
          <input
            className={styles.input}
            value={idInstance}
            onChange={(e) => {
              setIdInstance(e.target.value);
              setError(null);
            }}
            placeholder="idInstance"
            aria-label="idInstance"
            inputMode="numeric"
            autoComplete="off"
          />
          <input
            className={styles.input}
            type="password"
            value={apiTokenInstance}
            onChange={(e) => {
              setApiTokenInstance(e.target.value);
              setError(null);
            }}
            placeholder="apiTokenInstance"
            aria-label="apiTokenInstance"
            autoComplete="off"
          />
          <p className={styles.hint}>
            Данные инстанса можно найти в{' '}
            <a href="https://console.green-api.com" target="_blank" rel="noreferrer">
              личном кабинете
            </a>
          </p>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button className={styles.button} type="submit" disabled={!isFilled || loading}>
            Войти
          </button>
        </form>
      </div>
    </main>
  );
}
