import { ShortMemory } from './memory/ShortMemory';
import { LongMemory } from './memory/LongMemory';
import { SearchEngine } from './memory/SearchEngine';
import { MemoryEngine } from './memory/MemoryEngine';
import { GeminiProvider } from './llm/GeminiProvider';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  console.log('--- Iniciando Prueba de MemoryEngine ---');
  
  const shortMemory = new ShortMemory();
  await shortMemory.init();
  
  const longMemory = new LongMemory();
  const llm = new GeminiProvider();
  const searchEngine = new SearchEngine(llm);
  
  const memoryEngine = new MemoryEngine(
    shortMemory,
    longMemory,
    searchEngine,
    llm
  );

  const testMessage = "Recuerda que mi lenguaje de programación favorito es TypeScript.";
  console.log(`Usuario: ${testMessage}`);
  
  try {
    const response = await memoryEngine.processMessage(testMessage);
    console.log(`Brain: ${response}`);
    console.log('✅ Prueba completada con éxito.');
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

test();
