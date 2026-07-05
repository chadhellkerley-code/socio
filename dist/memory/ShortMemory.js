"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortMemory = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const config_1 = require("../config");
class ShortMemory {
    async init() {
        this.db = await (0, sqlite_1.open)({
            filename: config_1.config.sqlitePath,
            driver: sqlite3_1.default.Database
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
    async addMessage(message) {
        await this.db?.run('INSERT INTO messages (id, role, content, timestamp) VALUES (?, ?, ?, ?)', [message.id, message.role, message.content, message.timestamp]);
        await this.cleanup();
    }
    async getRecentMessages(limit = 20) {
        const rows = await this.db?.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?', [limit]);
        return rows?.reverse() || [];
    }
    async cleanup() {
        const expirationDate = Date.now() - config_1.config.shortMemoryExpirationDays * 24 * 60 * 60 * 1000;
        await this.db?.run('DELETE FROM messages WHERE timestamp < ?', [expirationDate]);
    }
}
exports.ShortMemory = ShortMemory;
