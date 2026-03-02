import crypto from 'crypto';
import { getDb } from './index';

export interface PipelineItem {
  id: string;
  title: string;
  description: string;
  stage: string;
  platform: string;
  owner_agent_id: string | null;
  position: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

type CreatePipelineItem = Omit<PipelineItem, 'id' | 'created_at' | 'updated_at'>;
type UpdatePipelineItem = Partial<Omit<PipelineItem, 'id' | 'created_at' | 'updated_at'>>;

function parseRow(row: Record<string, unknown>): PipelineItem {
  return {
    ...row,
    tags: JSON.parse((row.tags as string) || '[]'),
  } as PipelineItem;
}

export function list(): PipelineItem[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM pipeline_items ORDER BY stage, position').all() as Record<string, unknown>[];
  return rows.map(parseRow);
}

export function getById(id: string): PipelineItem | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM pipeline_items WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? parseRow(row) : undefined;
}

export function create(data: CreatePipelineItem): PipelineItem {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO pipeline_items (id, title, description, stage, platform, owner_agent_id, position, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    id,
    data.title,
    data.description,
    data.stage,
    data.platform,
    data.owner_agent_id,
    data.position,
    JSON.stringify(data.tags),
  );
  return getById(id)!;
}

export function update(id: string, data: UpdatePipelineItem): PipelineItem | undefined {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.stage !== undefined) { fields.push('stage = ?'); values.push(data.stage); }
  if (data.platform !== undefined) { fields.push('platform = ?'); values.push(data.platform); }
  if (data.owner_agent_id !== undefined) { fields.push('owner_agent_id = ?'); values.push(data.owner_agent_id); }
  if (data.position !== undefined) { fields.push('position = ?'); values.push(data.position); }
  if (data.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(data.tags)); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE pipeline_items SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id)!;
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM pipeline_items WHERE id = ?').run(id);
  return result.changes > 0;
}

export function reorder(itemId: string, newStage: string, newPosition: number): PipelineItem | undefined {
  const db = getDb();
  const item = getById(itemId);
  if (!item) return undefined;

  const tx = db.transaction(() => {
    // Remove from old position: shift items down in old stage
    db.prepare(`
      UPDATE pipeline_items SET position = position - 1, updated_at = datetime('now')
      WHERE stage = ? AND position > ?
    `).run(item.stage, item.position);

    // Make room in new stage: shift items up at and after new position
    db.prepare(`
      UPDATE pipeline_items SET position = position + 1, updated_at = datetime('now')
      WHERE stage = ? AND position >= ?
    `).run(newStage, newPosition);

    // Move item to new stage and position
    db.prepare(`
      UPDATE pipeline_items SET stage = ?, position = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newStage, newPosition, itemId);
  });

  tx();
  return getById(itemId)!;
}
