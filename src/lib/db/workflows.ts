import crypto from 'crypto';
import { getDb } from './index';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  steps: number;
  active: number;
  total_runs: number;
  success_rate: number;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
  updated_at: string;
}

type CreateWorkflow = Omit<Workflow, 'id' | 'created_at' | 'updated_at'>;
type UpdateWorkflow = Partial<Omit<Workflow, 'id' | 'created_at' | 'updated_at'>>;

export function list(): Workflow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM workflows ORDER BY created_at DESC').all() as Workflow[];
}

export function getById(id: string): Workflow | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM workflows WHERE id = ?').get(id) as Workflow | undefined;
}

export function create(data: CreateWorkflow): Workflow {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO workflows (id, name, description, trigger_type, steps, active, total_runs, success_rate, last_run, next_run, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    id,
    data.name,
    data.description,
    data.trigger_type,
    data.steps,
    data.active,
    data.total_runs,
    data.success_rate,
    data.last_run,
    data.next_run,
  );
  return getById(id)!;
}

export function update(id: string, data: UpdateWorkflow): Workflow | undefined {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.trigger_type !== undefined) { fields.push('trigger_type = ?'); values.push(data.trigger_type); }
  if (data.steps !== undefined) { fields.push('steps = ?'); values.push(data.steps); }
  if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active); }
  if (data.total_runs !== undefined) { fields.push('total_runs = ?'); values.push(data.total_runs); }
  if (data.success_rate !== undefined) { fields.push('success_rate = ?'); values.push(data.success_rate); }
  if (data.last_run !== undefined) { fields.push('last_run = ?'); values.push(data.last_run); }
  if (data.next_run !== undefined) { fields.push('next_run = ?'); values.push(data.next_run); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE workflows SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id)!;
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM workflows WHERE id = ?').run(id);
  return result.changes > 0;
}
