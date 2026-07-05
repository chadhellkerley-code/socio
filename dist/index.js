"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const ShortMemory_1 = require("./memory/ShortMemory");
const LongMemory_1 = require("./memory/LongMemory");
const SearchEngine_1 = require("./memory/SearchEngine");
const MemoryEngine_1 = require("./memory/MemoryEngine");
const GeminiProvider_1 = require("./llm/GeminiProvider");
const TelegramBot_1 = require("./telegram/TelegramBot");
const server_1 = require("./api/server");
async function main() {
    console.log('--- Iniciando Brain Project ---');
    // 1. Inicializar componentes
    const shortMemory = new ShortMemory_1.ShortMemory();
    await shortMemory.init();
    console.log('✅ Memoria corta (SQLite) inicializada.');
    const longMemory = new LongMemory_1.LongMemory();
    const llm = new GeminiProvider_1.GeminiProvider();
    const searchEngine = new SearchEngine_1.SearchEngine(llm);
    const memoryEngine = new MemoryEngine_1.MemoryEngine(shortMemory, longMemory, searchEngine, llm);
    const bot = new TelegramBot_1.TelegramBot(memoryEngine);
    await bot.launch();
    console.log('✅ Bot de Telegram listo.');
    // 2. Iniciar servidor API (para Webhooks y salud)
    const app = (0, server_1.createServer)(bot);
    app.listen(config_1.config.port, () => {
        console.log(`✅ Brain API escuchando en el puerto ${config_1.config.port}`);
    });
}
main().catch(err => {
    console.error('❌ Error fatal al iniciar el proyecto:', err);
    process.exit(1);
});
