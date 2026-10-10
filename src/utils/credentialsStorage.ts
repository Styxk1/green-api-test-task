import type { Credentials } from '../types/greenApi';

const KEY = 'credentials';

export function loadCredentials(): Credentials | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (typeof data?.idInstance !== 'string' || typeof data?.apiTokenInstance !== 'string') {
      return null;
    }

    return { idInstance: data.idInstance, apiTokenInstance: data.apiTokenInstance };
  } catch {
    return null;
  }
}

export function saveCredentials(credentials: Credentials) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(credentials));
  } catch {
    return;
  }
}

export function clearCredentials() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    return;
  }
}
