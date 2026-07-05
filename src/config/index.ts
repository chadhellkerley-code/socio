import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegramToken: process.env.TELEGRAM_TOKEN || '',
  webhookUrl: process.env.WEBHOOK_URL || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  sqlitePath: process.env.SQLITE_PATH || './brain_memory.sqlite',
  obsidianVaultPath: process.env.OBSIDIAN_VAULT_PATH || './Vault',
  shortMemoryExpirationDays: parseInt(process.env.SHORT_MEMORY_EXPIRATION || '30'),
  llmProvider: process.env.LLM_PROVIDER || 'gemini',
  port: parseInt(process.env.PORT || '3000'),
};

if (!config.telegramToken || !config.geminiApiKey) {
  console.warn('Warning: Missing essential configuration. Check your .env file.');
}
