import crypto from 'crypto';
import { getDb } from './index';

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  agent_id: string | null;
  created_at: string;
}

type CreateActivityEvent = Omit<ActivityEvent, 'id' | 'created_at'>;

export function list(limit = 50, offset = 0): ActivityEvent[] {
  const db = getDb();
  return db.prepare(
    'SELECT * FROM activity_events ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(limit, offset) as ActivityEvent[];
}

export function create(data: CreateActivityEvent): ActivityEvent {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO activity_events (id, type, title, description, agent_id, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    id,
    data.type,
    data.title,
    data.description,
    data.agent_id,
  );
  return db.prepare('SELECT * FROM activity_events WHERE id = ?').get(id) as ActivityEvent;
}
