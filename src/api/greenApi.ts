import type { Credentials, StateInstanceResponse } from '../types/greenApi';

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

export async function sendAuthorizationPassword(
  credentials: Credentials,
): Promise<StateInstanceResponse> {
  const res = await fetch(buildUrl(credentials, 'sendAuthorizationPassword'));

  if (!res.ok) {
    throw new ApiError(res.status);
  }

  return res.json();
}
