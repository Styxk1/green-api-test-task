import type { Chat, Message } from '../types/chat';
import type { IncomingMessageWebhook, WebhookBody } from '../types/greenApi';
import { formatPhone, phoneToChatId } from './phone';

export interface IncomingMessage {
  chat: Chat;
  message: Message;
}

export const parseNotification = (body: WebhookBody): IncomingMessage | null => {
  if (body.typeWebhook !== 'incomingMessageReceived') return null;

  const { idMessage, timestamp, senderData, messageData } = body as IncomingMessageWebhook;
  if (senderData.chatType === 'group') return null;

  const text =
    messageData.textMessageData?.textMessage ?? messageData.extendedTextMessageData?.text;
  if (!text) return null;

  const phone = senderData.senderPhoneNumber ? String(senderData.senderPhoneNumber) : null;
  const chatId = phone ? phoneToChatId(phone) : senderData.chatId;
  const name =
    senderData.senderName || senderData.chatName || (phone ? formatPhone(phone) : chatId);

  return {
    chat: { chatId, name },
    message: { id: idMessage, chatId, text, timestamp: timestamp * 1000, direction: 'in' },
  };
};
