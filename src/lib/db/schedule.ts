import crypto from 'crypto';
import { getDb } from './index';

export interface ScheduledJob {
  id: string;
  title: string;
  cron_expression: string | null;
  is_always_running: number;
  color: string;
  next_run_at: string | null;
  status: string;
  agent_id: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

type CreateScheduledJob = Omit<ScheduledJob, 'id' | 'created_at' | 'updated_at'>;
type UpdateScheduledJob = Partial<Omit<ScheduledJob, 'id' | 'created_at' | 'updated_at'>>;

export function list(): ScheduledJob[] {
  const db = getDb();
  return db.prepare('SELECT * FROM scheduled_jobs ORDER BY created_at DESC').all() as ScheduledJob[];
}

export function getById(id: string): ScheduledJob | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM scheduled_jobs WHERE id = ?').get(id) as ScheduledJob | undefined;
}

export function create(data: CreateScheduledJob): ScheduledJob {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO scheduled_jobs (id, title, cron_expression, is_always_running, color, next_run_at, status, agent_id, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    id,
    data.title,
    data.cron_expression,
    data.is_always_running,
    data.color,
    data.next_run_at,
    data.status,
    data.agent_id,
    data.description,
  );
  return getById(id)!;
}

export function update(id: string, data: UpdateScheduledJob): ScheduledJob | undefined {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.cron_expression !== undefined) { fields.push('cron_expression = ?'); values.push(data.cron_expression); }
  if (data.is_always_running !== undefined) { fields.push('is_always_running = ?'); values.push(data.is_always_running); }
  if (data.color !== undefined) { fields.push('color = ?'); values.push(data.color); }
  if (data.next_run_at !== undefined) { fields.push('next_run_at = ?'); values.push(data.next_run_at); }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
  if (data.agent_id !== undefined) { fields.push('agent_id = ?'); values.push(data.agent_id); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE scheduled_jobs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id)!;
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM scheduled_jobs WHERE id = ?').run(id);
  return result.changes > 0;
}
