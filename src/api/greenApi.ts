import type {
  Credentials,
  Notification,
  SendMessageResponse,
  StateInstanceResponse,
} from '../types/greenApi';

const API_URL = import.meta.env.VITE_GREEN_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`GREEN-API: ${status}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

const buildUrl = ({ idInstance, apiTokenInstance }: Credentials, method: string) =>
  `${API_URL}/waInstance${idInstance}/${method}/${apiTokenInstance}`;

export async function getStateInstance(credentials: Credentials): Promise<StateInstanceResponse> {
  const res = await fetch(buildUrl(credentials, 'getStateInstance'));

  if (!res.ok) {
    throw new ApiError(res.status);
  }

  return res.json();
}

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const res = await fetch(buildUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });

  if (!res.ok) {
    throw new ApiError(res.status);
  }

  return res.json();
}

export async function receiveNotification(
  credentials: Credentials,
  signal?: AbortSignal,
): Promise<Notification | null> {
  const res = await fetch(`${buildUrl(credentials, 'receiveNotification')}?receiveTimeout=20`, {
    signal,
  });

  if (!res.ok) {
    throw new ApiError(res.status);
  }

  return res.json();
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<{ result: boolean }> {
  const res = await fetch(`${buildUrl(credentials, 'deleteNotification')}/${receiptId}`, {
    method: 'DELETE',
    signal,
  });

  if (!res.ok) {
    throw new ApiError(res.status);
  }

  return res.json();
}
