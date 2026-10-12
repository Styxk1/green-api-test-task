import { useEffect, useEffectEvent } from 'react';
import { deleteNotification, receiveNotification } from '../api/greenApi';
import type { Credentials } from '../types/greenApi';
import { parseNotification, type IncomingMessage } from '../utils/notification';

const RETRY_DELAY = 5000;

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

export function useNotifications(
  credentials: Credentials,
  onMessage: (incoming: IncomingMessage) => void,
) {
  const handleMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const poll = async () => {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(credentials, signal);
          if (!notification) continue;

          const parsed = parseNotification(notification.body);
          if (parsed) handleMessage(parsed);

          await deleteNotification(credentials, notification.receiptId, signal);
        } catch {
          if (!signal.aborted) await sleep(RETRY_DELAY, signal);
        }
      }
    };

    poll();

    return () => controller.abort();
  }, [credentials]);
}
