import express from 'express';
import { TelegramBot } from '../telegram/TelegramBot';
import { config } from '../config';

export function createServer(bot: TelegramBot) {
  const app = express();
  app.use(express.json());

  app.post('/webhook/telegram', async (req, res) => {
    try {
      await bot.handleUpdate(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error handling Telegram update:', error);
      res.sendStatus(500);
    }
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', project: 'Brain' });
  });

  return app;
}
