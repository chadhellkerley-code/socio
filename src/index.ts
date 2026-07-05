import { config } from './config';
import { ShortMemory } from './memory/ShortMemory';
import { LongMemory } from './memory/LongMemory';
import { SearchEngine } from './memory/SearchEngine';
import { MemoryEngine } from './memory/MemoryEngine';
import { GeminiProvider } from './llm/GeminiProvider';
import { TelegramBot } from './telegram/TelegramBot';
import { createServer } from './api/server';

async function main() {
  console.log('--- Iniciando Brain Project ---');

  // 1. Inicializar componentes
  const shortMemory = new ShortMemory();
  await shortMemory.init();
  console.log('✅ Memoria corta (SQLite) inicializada.');

  const longMemory = new LongMemory();
  const llm = new GeminiProvider();
  const searchEngine = new SearchEngine(llm);
  
  const memoryEngine = new MemoryEngine(
    shortMemory,
    longMemory,
    searchEngine,
    llm
  );

  const bot = new TelegramBot(memoryEngine);
  await bot.launch();
  console.log('✅ Bot de Telegram listo.');

  // 2. Iniciar servidor API (para Webhooks y salud)
  const app = createServer(bot);
  app.listen(config.port, () => {
    console.log(`✅ Brain API escuchando en el puerto ${config.port}`);
  });
}

main().catch(err => {
  console.error('❌ Error fatal al iniciar el proyecto:', err);
  process.exit(1);
});
