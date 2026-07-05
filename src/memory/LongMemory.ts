import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LongMemoryNote } from '../types';
import { config } from '../config';

export class LongMemory {
  private supabase: SupabaseClient;
  private bucketName = 'brain-vault';

  constructor() {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  async saveNote(folder: string, note: LongMemoryNote) {
    const fileName = `${folder}/${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    const content = this.formatMarkdown(note);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(fileName, content, {
        contentType: 'text/markdown',
        upsert: true
      });

    if (error) {
      console.error('Error al guardar nota en Supabase Storage:', error);
    }
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
}
