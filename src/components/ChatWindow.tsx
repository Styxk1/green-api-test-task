import { useEffect, useRef } from 'react';
import type { Chat, Message } from '../types/chat';
import { formatTime } from '../utils/formatTime';
import { Avatar } from './Avatar';
import styles from './ChatWindow.module.css';
import { MessageInput } from './MessageInput';

interface Props {
  chat: Chat;
  messages: Message[];
  onSend: (text: string) => void;
  onBack: () => void;
}

export function ChatWindow({ chat, messages, onSend, onBack }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [chat.chatId, messages.length]);

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Назад">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <Avatar name={chat.name} seed={chat.chatId} size={40} />
        <span className={styles.name}>{chat.name}</span>
      </header>

      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={[
              styles.bubble,
              message.direction === 'out' && styles.out,
              message.failed && styles.failed,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className={styles.text}>{message.text}</span>
            <span className={styles.meta}>
              {message.failed ? (
                <span className={styles.error}>Не отправлено</span>
              ) : (
                formatTime(message.timestamp)
              )}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput key={chat.chatId} onSend={onSend} />
    </section>
  );
}
