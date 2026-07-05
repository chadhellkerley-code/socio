import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Message } from '../types';
import { config } from '../config';

export class ShortMemory {
  private db?: Database;

  async init() {
    this.db = await open({
      filename: config.sqlitePath,
      driver: sqlite3.Database
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        role TEXT,
        content TEXT,
        timestamp INTEGER
      )
    `);
  }

  async addMessage(message: Message) {
    await this.db?.run(
      'INSERT INTO messages (id, role, content, timestamp) VALUES (?, ?, ?, ?)',
      [message.id, message.role, message.content, message.timestamp]
    );
    await this.cleanup();
  }

  async getRecentMessages(limit: number = 20): Promise<Message[]> {
    const rows = await this.db?.all<Message[]>(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?',
      [limit]
    );
    return rows?.reverse() || [];
  }

  private async cleanup() {
    const expirationDate = Date.now() - config.shortMemoryExpirationDays * 24 * 60 * 60 * 1000;
    await this.db?.run('DELETE FROM messages WHERE timestamp < ?', [expirationDate]);
  }
}
