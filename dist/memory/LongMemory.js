"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongMemory = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
class LongMemory {
    constructor() {
        this.vaultPath = config_1.config.obsidianVaultPath;
    }
    async saveNote(folder, note) {
        const folderPath = path_1.default.join(this.vaultPath, folder);
        await promises_1.default.mkdir(folderPath, { recursive: true });
        const fileName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
        const filePath = path_1.default.join(folderPath, fileName);
        const content = this.formatMarkdown(note);
        await promises_1.default.writeFile(filePath, content, 'utf8');
    }
    formatMarkdown(note) {
        return `---
title: ${note.title}
created: ${note.created}
updated: ${note.updated}
tags: [${note.tags.join(', ')}]
aliases: [${note.aliases.join(', ')}]
---

# ${note.title}

## Summary
${note.summary}

## Context
${note.context}

## Knowledge
${note.knowledge}

## Related Notes
${note.relatedNotes.map(n => `[[${n}]]`).join(', ')}

## Next Steps
${note.nextSteps.map(s => `- ${s}`).join('\n')}
`;
    }
    async searchNotes(query) {
        // Aquí se integrará con el motor de búsqueda semántica
        return [];
    }
}
exports.LongMemory = LongMemory;
