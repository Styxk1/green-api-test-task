import type { Chat, Message } from '../types/chat';
import { formatTime } from '../utils/formatTime';
import { Avatar } from './Avatar';
import styles from './ChatList.module.css';

interface Props {
  chats: Chat[];
  lastMessages: Record<string, Message | undefined>;
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
}

export function ChatList({ chats, lastMessages, activeChatId, onSelect }: Props) {
  return (
    <ul className={styles.list}>
      {chats.map((chat) => {
        const lastMessage = lastMessages[chat.chatId];
        const isActive = chat.chatId === activeChatId;

        return (
          <li key={chat.chatId}>
            <button
              type="button"
              className={isActive ? `${styles.item} ${styles.active}` : styles.item}
              onClick={() => onSelect(chat.chatId)}
              aria-current={isActive}
            >
              <Avatar name={chat.name} seed={chat.chatId} />
              <div className={styles.body}>
                <div className={styles.top}>
                  <span className={styles.name}>{chat.name}</span>
                  {lastMessage && (
                    <span className={styles.time}>{formatTime(lastMessage.timestamp)}</span>
                  )}
                </div>
                <p className={styles.preview}>
                  {lastMessage
                    ? `${lastMessage.direction === 'out' ? 'Вы: ' : ''}${lastMessage.text}`
                    : 'Нет сообщений'}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
