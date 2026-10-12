import { useState } from 'react';
import { sendMessage } from '../api/greenApi';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { NewChatDialog } from '../components/NewChatDialog';
import { useNotifications } from '../hooks/useNotifications';
import type { Chat, Message } from '../types/chat';
import type { Credentials } from '../types/greenApi';
import type { IncomingMessage } from '../utils/notification';
import { formatPhone, phoneToChatId } from '../utils/phone';
import styles from './ChatPage.module.css';

interface Props {
  credentials: Credentials;
}

export function ChatPage({ credentials }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const activeChat = chats.find((chat) => chat.chatId === activeChatId);

  const lastMessages: Record<string, Message | undefined> = {};
  for (const message of messages) {
    lastMessages[message.chatId] = message;
  }

  const sortedChats = [...chats].sort(
    (a, b) => (lastMessages[b.chatId]?.timestamp ?? 0) - (lastMessages[a.chatId]?.timestamp ?? 0),
  );

  const handleCreateChat = (phone: string) => {
    const chatId = phoneToChatId(phone);
    if (!chats.some((chat) => chat.chatId === chatId)) {
      setChats((prev) => [...prev, { chatId, name: formatPhone(phone) }]);
    }
    setActiveChatId(chatId);
    setIsNewChatOpen(false);
  };

  const updateMessage = (id: string, patch: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, ...patch } : message)),
    );
  };

  const handleIncoming = ({ chat, message }: IncomingMessage) => {
    setChats((prev) => (prev.some((c) => c.chatId === chat.chatId) ? prev : [...prev, chat]));
    setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
  };

  useNotifications(credentials, handleIncoming);

  const handleSend = async (text: string) => {
    if (!activeChatId) return;

    const id = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id,
        chatId: activeChatId,
        text,
        timestamp: Date.now(),
        direction: 'out',
      },
    ]);

    try {
      await sendMessage(credentials, activeChatId, text);
    } catch {
      updateMessage(id, { failed: true });
    }
  };

  return (
    <div className={activeChat ? `${styles.page} ${styles.hasActive}` : styles.page}>
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <h1 className={styles.title}>Чаты</h1>
          <button
            type="button"
            className={styles.newChat}
            onClick={() => setIsNewChatOpen(true)}
            aria-label="Новый чат"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <ChatList
          chats={sortedChats}
          lastMessages={lastMessages}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
        />
      </aside>

      <main className={styles.main}>
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            messages={messages.filter((message) => message.chatId === activeChat.chatId)}
            onSend={handleSend}
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <div className={styles.placeholder}>
            {chats.length > 0
              ? 'Выберите чат, чтобы начать общение'
              : 'Нажмите «+», чтобы написать по номеру телефона'}
          </div>
        )}
      </main>

      <NewChatDialog
        open={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onSubmit={handleCreateChat}
      />
    </div>
  );
}
