import express from 'express';
import { TelegramBot } from '../telegram/TelegramBot';

export function createServer(bot: TelegramBot) {
  const app = express();
  app.use(express.json());

  // Vercel usará esta ruta para el webhook de Telegram
  app.post('/api/webhook', async (req, res) => {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling Telegram update:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', project: 'Brain', platform: 'Vercel' });
  });

  // Ruta por defecto
  app.get('/', (req, res) => {
    res.send('Brain AI is running on Vercel.');
  });

  return app;
}
