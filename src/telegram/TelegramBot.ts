import { Telegraf } from 'telegraf';
import { MemoryEngine } from '../memory/MemoryEngine';
import { config } from '../config';

export class TelegramBot {
  private bot: Telegraf;

  constructor(private memoryEngine: MemoryEngine) {
    this.bot = new Telegraf(config.telegramToken);
    this.setupHandlers();
  }

  private setupHandlers() {
    this.bot.on('text', async (ctx) => {
      try {
        const response = await this.memoryEngine.processMessage(ctx.message.text);
        await ctx.reply(response);
      } catch (error) {
        console.error('Error en handler de texto:', error);
        await ctx.reply('Lo siento, hubo un error procesando tu mensaje.');
      }
    });

    this.bot.on('voice', async (ctx) => {
      try {
        await ctx.reply('Procesando tu mensaje de voz...');
        // Aquí iría la integración con Whisper o Gemini para transcripción
        const transcript = "Funcionalidad de transcripción de voz en desarrollo.";
        const response = await this.memoryEngine.processMessage(transcript);
        await ctx.reply(response);
      } catch (error) {
        console.error('Error en handler de voz:', error);
      }
    });
  }

  async handleUpdate(update: any) {
    return this.bot.handleUpdate(update);
  }

  async launch() {
    if (config.webhookUrl) {
      console.log(`Configurando webhook en: ${config.webhookUrl}`);
      await this.bot.telegram.setWebhook(`${config.webhookUrl}/webhook/telegram`);
    } else {
      console.log('Iniciando bot en modo polling...');
      this.bot.launch();
    }
  }
}
