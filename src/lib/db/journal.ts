import crypto from 'crypto';
import { getDb } from './index';

export interface JournalEntry {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  agent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryWithCount extends JournalEntry {
  sub_entry_count: number;
}

export interface JournalSubEntry {
  id: string;
  journal_entry_id: string;
  content: string;
  entry_type: string;
  created_at: string;
}

export interface JournalEntryWithSubEntries extends JournalEntry {
  sub_entries: JournalSubEntry[];
}

type CreateJournalEntry = Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;
type UpdateJournalEntry = Partial<Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>>;
type CreateJournalSubEntry = Omit<JournalSubEntry, 'id' | 'journal_entry_id' | 'created_at'>;

function parseRow(row: Record<string, unknown>): JournalEntry {
  return {
    ...row,
    tags: JSON.parse((row.tags as string) || '[]'),
  } as JournalEntry;
}

export function list(): JournalEntryWithCount[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT je.*, COUNT(jse.id) AS sub_entry_count
    FROM journal_entries je
    LEFT JOIN journal_sub_entries jse ON jse.journal_entry_id = je.id
    GROUP BY je.id
    ORDER BY je.created_at DESC
  `).all() as Record<string, unknown>[];

  return rows.map((row) => ({
    ...parseRow(row),
    sub_entry_count: row.sub_entry_count as number,
  }));
}

export function getById(id: string): JournalEntryWithSubEntries | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return undefined;

  const subEntries = db.prepare(
    'SELECT * FROM journal_sub_entries WHERE journal_entry_id = ? ORDER BY created_at ASC'
  ).all(id) as JournalSubEntry[];

  return {
    ...parseRow(row),
    sub_entries: subEntries,
  };
}

export function create(data: CreateJournalEntry): JournalEntryWithSubEntries {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO journal_entries (id, title, summary, content, tags, agent_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    id,
    data.title,
    data.summary,
    data.content,
    JSON.stringify(data.tags),
    data.agent_id,
  );
  return getById(id)!;
}

export function update(id: string, data: UpdateJournalEntry): JournalEntryWithSubEntries | undefined {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.summary !== undefined) { fields.push('summary = ?'); values.push(data.summary); }
  if (data.content !== undefined) { fields.push('content = ?'); values.push(data.content); }
  if (data.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(data.tags)); }
  if (data.agent_id !== undefined) { fields.push('agent_id = ?'); values.push(data.agent_id); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE journal_entries SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id)!;
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM journal_entries WHERE id = ?').run(id);
  return result.changes > 0;
}

export function addSubEntry(journalEntryId: string, data: CreateJournalSubEntry): JournalSubEntry | undefined {
  const db = getDb();
  const parent = db.prepare('SELECT id FROM journal_entries WHERE id = ?').get(journalEntryId);
  if (!parent) return undefined;

  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO journal_sub_entries (id, journal_entry_id, content, entry_type, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(id, journalEntryId, data.content, data.entry_type);

  // Also bump parent updated_at
  db.prepare("UPDATE journal_entries SET updated_at = datetime('now') WHERE id = ?").run(journalEntryId);

  return db.prepare('SELECT * FROM journal_sub_entries WHERE id = ?').get(id) as JournalSubEntry;
}
