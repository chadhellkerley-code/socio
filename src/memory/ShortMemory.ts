import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Message } from '../types';
import { config } from '../config';

export class ShortMemory {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  async init() {
    // En Supabase, las tablas se crean manualmente o vía SQL en el dashboard.
    // Asumimos que la tabla 'messages' existe.
    console.log('Conectado a Supabase para memoria corta.');
  }

  async addMessage(message: Message) {
    const { error } = await this.supabase
      .from('messages')
      .insert([{
        id: message.id,
        role: message.role,
        content: message.content,
        timestamp: new Date(message.timestamp).toISOString()
      }]);

    if (error) {
      console.error('Error al guardar mensaje en Supabase:', error);
    }
    await this.cleanup();
  }

  async getRecentMessages(limit: number = 20): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error al obtener mensajes de Supabase:', error);
      return [];
    }

    return (data || []).reverse().map(row => ({
      id: row.id,
      role: row.role,
      content: row.content,
      timestamp: new Date(row.timestamp).getTime()
    }));
  }

  private async cleanup() {
    const expirationDate = new Date(Date.now() - config.shortMemoryExpirationDays * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await this.supabase
      .from('messages')
      .delete()
      .lt('timestamp', expirationDate);

    if (error) {
      console.error('Error en cleanup de Supabase:', error);
    }
  }
}
