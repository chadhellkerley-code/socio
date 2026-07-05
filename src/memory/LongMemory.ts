import fs from 'fs/promises';
import path from 'path';
import { LongMemoryNote } from '../types';
import { config } from '../config';

export class LongMemory {
  private vaultPath: string;

  constructor() {
    this.vaultPath = config.obsidianVaultPath;
  }

  async saveNote(folder: string, note: LongMemoryNote) {
    const folderPath = path.join(this.vaultPath, folder);
    await fs.mkdir(folderPath, { recursive: true });

    const fileName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    const filePath = path.join(folderPath, fileName);

    const content = this.formatMarkdown(note);
    await fs.writeFile(filePath, content, 'utf8');
  }

  private formatMarkdown(note: LongMemoryNote): string {
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

  async searchNotes(query: string): Promise<string[]> {
    // Aquí se integrará con el motor de búsqueda semántica
    return [];
  }
}
