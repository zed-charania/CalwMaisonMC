import crypto from 'crypto';
import { getDb } from './index';

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  status: string;
  traits: string[];
  input_signals: string[];
  output_actions: string[];
  parent_agent_id: string | null;
  created_at: string;
  updated_at: string;
}

type CreateAgent = Omit<Agent, 'id' | 'created_at' | 'updated_at'>;
type UpdateAgent = Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>;

function parseRow(row: Record<string, unknown>): Agent {
  return {
    ...row,
    traits: JSON.parse((row.traits as string) || '[]'),
    input_signals: JSON.parse((row.input_signals as string) || '[]'),
    output_actions: JSON.parse((row.output_actions as string) || '[]'),
  } as Agent;
}

export function list(): Agent[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM agents ORDER BY created_at ASC').all() as Record<string, unknown>[];
  return rows.map(parseRow);
}

export function getById(id: string): Agent | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? parseRow(row) : undefined;
}

export function create(data: CreateAgent): Agent {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO agents (id, name, role, avatar_color, status, traits, input_signals, output_actions, parent_agent_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    id,
    data.name,
    data.role,
    data.avatar_color,
    data.status,
    JSON.stringify(data.traits),
    JSON.stringify(data.input_signals),
    JSON.stringify(data.output_actions),
    data.parent_agent_id,
  );
  return getById(id)!;
}

export function update(id: string, data: UpdateAgent): Agent | undefined {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.role !== undefined) { fields.push('role = ?'); values.push(data.role); }
  if (data.avatar_color !== undefined) { fields.push('avatar_color = ?'); values.push(data.avatar_color); }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
  if (data.traits !== undefined) { fields.push('traits = ?'); values.push(JSON.stringify(data.traits)); }
  if (data.input_signals !== undefined) { fields.push('input_signals = ?'); values.push(JSON.stringify(data.input_signals)); }
  if (data.output_actions !== undefined) { fields.push('output_actions = ?'); values.push(JSON.stringify(data.output_actions)); }
  if (data.parent_agent_id !== undefined) { fields.push('parent_agent_id = ?'); values.push(data.parent_agent_id); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE agents SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id)!;
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM agents WHERE id = ?').run(id);
  return result.changes > 0;
}
