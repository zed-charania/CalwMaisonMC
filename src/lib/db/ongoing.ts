import crypto from 'crypto';
import { getDb } from './index';

export interface OngoingTask {
  id: string;
  title: string;
  state: string;
  current_step: string;
  progress: number;
  agent_id: string | null;
  blockers: string[];
  started_at: string;
  estimated_completion: string | null;
  created_at: string;
  updated_at: string;
}

type CreateOngoingTask = Omit<OngoingTask, 'id' | 'created_at' | 'updated_at'>;
type UpdateOngoingTask = Partial<Omit<OngoingTask, 'id' | 'created_at' | 'updated_at'>>;

function parseRow(row: Record<string, unknown>): OngoingTask {
  return {
    ...row,
    blockers: JSON.parse((row.blockers as string) || '[]'),
  } as OngoingTask;
}

export function list(): OngoingTask[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM ongoing_tasks ORDER BY created_at DESC').all() as Record<string, unknown>[];
  return rows.map(parseRow);
}

export function getById(id: string): OngoingTask | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM ongoing_tasks WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? parseRow(row) : undefined;
}

export function create(data: CreateOngoingTask): OngoingTask {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO ongoing_tasks (id, title, state, current_step, progress, agent_id, blockers, started_at, estimated_completion, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    id,
    data.title,
    data.state,
    data.current_step,
    data.progress,
    data.agent_id,
    JSON.stringify(data.blockers),
    data.started_at,
    data.estimated_completion,
  );
  return getById(id)!;
}

export function update(id: string, data: UpdateOngoingTask): OngoingTask | undefined {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.state !== undefined) { fields.push('state = ?'); values.push(data.state); }
  if (data.current_step !== undefined) { fields.push('current_step = ?'); values.push(data.current_step); }
  if (data.progress !== undefined) { fields.push('progress = ?'); values.push(data.progress); }
  if (data.agent_id !== undefined) { fields.push('agent_id = ?'); values.push(data.agent_id); }
  if (data.blockers !== undefined) { fields.push('blockers = ?'); values.push(JSON.stringify(data.blockers)); }
  if (data.started_at !== undefined) { fields.push('started_at = ?'); values.push(data.started_at); }
  if (data.estimated_completion !== undefined) { fields.push('estimated_completion = ?'); values.push(data.estimated_completion); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE ongoing_tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id)!;
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM ongoing_tasks WHERE id = ?').run(id);
  return result.changes > 0;
}
