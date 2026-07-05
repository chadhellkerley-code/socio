import express from 'express';
import { TelegramBot } from '../telegram/TelegramBot';

export function createServer(bot: TelegramBot) {
  const app = express();
  app.use(express.json());

  // Vercel usará esta ruta para el webhook de Telegram
  // Aceptamos ambas rutas por seguridad
  const webhookHandler = async (req: any, res: any) => {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling Telegram update:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  app.post('/api/webhook', webhookHandler);
  app.post('/webhook/telegram', webhookHandler);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', project: 'Brain', platform: 'Vercel' });
  });
  app.get('/webhook/telegram', (req, res) => {
    res.send('Webhook endpoint is active.');
  });

  // Ruta por defecto
  app.get('/', (req, res) => {
    res.send('Brain AI is running on Vercel.');
  });

  return app;
}
