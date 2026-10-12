export interface Chat {
  chatId: string;
  name: string;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: 'in' | 'out';
  failed?: boolean;
}
