# GREEN-API Chat

Тестовое задание на должность «Фронтенд разработчик React»: интерфейс для отправки и получения текстовых сообщений в MAX через [GREEN-API](https://green-api.com/max).

## Возможности

- Вход по `idInstance` и `apiTokenInstance` с проверкой состояния инстанса
- Создание чата по номеру телефона получателя
- Отправка текстовых сообщений ([SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/))
- Получение входящих текстовых сообщений ([HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/))

## Стек

- React + TypeScript
- Vite
- ESLint + Prettier

## Запуск

1. Скопировать `.env.example` в `.env` и указать в `VITE_GREEN_API_URL` значение `apiUrl` своего инстанса из [консоли GREEN-API](https://console.green-api.com):

   ```bash
   cp .env.example .env
   ```

2. В настройках инстанса в консоли GREEN-API включить уведомления о входящих сообщениях.

3. Установить зависимости и запустить:

   ```bash
   npm install
   npm run dev
   ```
