"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBot = void 0;
const telegraf_1 = require("telegraf");
const config_1 = require("../config");
class TelegramBot {
    constructor(memoryEngine) {
        this.memoryEngine = memoryEngine;
        this.bot = new telegraf_1.Telegraf(config_1.config.telegramToken);
        this.setupHandlers();
    }
    setupHandlers() {
        this.bot.on('text', async (ctx) => {
            try {
                const response = await this.memoryEngine.processMessage(ctx.message.text);
                await ctx.reply(response);
            }
            catch (error) {
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
            }
            catch (error) {
                console.error('Error en handler de voz:', error);
            }
        });
    }
    async handleUpdate(update) {
        return this.bot.handleUpdate(update);
    }
    async launch() {
        if (config_1.config.webhookUrl) {
            console.log(`Configurando webhook en: ${config_1.config.webhookUrl}`);
            await this.bot.telegram.setWebhook(`${config_1.config.webhookUrl}/webhook/telegram`);
        }
        else {
            console.log('Iniciando bot en modo polling...');
            this.bot.launch();
        }
    }
}
exports.TelegramBot = TelegramBot;
