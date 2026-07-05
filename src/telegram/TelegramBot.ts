import { MemoryEngine } from '../memory/MemoryEngine';
import { config } from '../config';

export class TelegramBot {
  constructor(private memoryEngine: MemoryEngine) {}

  async handleUpdate(update: any) {
    if (update.message) {
      const chatId = update.message.chat.id;
      
      if (update.message.text) {
        const response = await this.memoryEngine.processMessage(update.message.text);
        await this.sendMessage(chatId, response);
      } else if (update.message.voice) {
        // Lógica para procesar voz
        console.log('Procesando mensaje de voz...');
        const transcript = "Transcripción simulada de voz";
        const response = await this.memoryEngine.processMessage(transcript);
        await this.sendMessage(chatId, response);
      }
    }
  }

  private async sendMessage(chatId: number, text: string) {
    // Llamada a la API de Telegram para enviar mensaje
    console.log(`Enviando mensaje a ${chatId}: ${text}`);
  }
}
