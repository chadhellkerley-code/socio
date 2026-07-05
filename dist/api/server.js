"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
function createServer(bot) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/webhook/telegram', async (req, res) => {
        try {
            await bot.handleUpdate(req.body);
            res.sendStatus(200);
        }
        catch (error) {
            console.error('Error handling Telegram update:', error);
            res.sendStatus(500);
        }
    });
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', project: 'Brain' });
    });
    return app;
}
