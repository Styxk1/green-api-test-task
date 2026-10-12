export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export type StateInstance =
  'notAuthorized' | 'authorized' | 'blocked' | 'starting' | 'suspended' | 'pendingPassword';

export interface StateInstanceResponse {
  stateInstance: StateInstance;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface WebhookBody {
  typeWebhook: string;
}

export interface IncomingMessageWebhook extends WebhookBody {
  typeWebhook: 'incomingMessageReceived';
  idMessage: string;
  timestamp: number;
  senderData: {
    chatId: string;
    chatType?: string;
    chatName?: string;
    senderName?: string;
    senderPhoneNumber?: number;
  };
  messageData: {
    typeMessage: string;
    textMessageData?: { textMessage: string };
    extendedTextMessageData?: { text: string };
  };
}

export interface Notification {
  receiptId: number;
  body: WebhookBody;
}
