'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { JournalEntry, Agent } from '@/lib/types';

interface JournalSidebarProps {
  entries: JournalEntry[];
  agentMap: Map<string, Agent>;
  selectedEntryId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

function groupByDate(entries: JournalEntry[]): { label: string; entries: JournalEntry[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  const monthAgo = new Date(today.getTime() - 30 * 86400000);

  const groups: Record<string, JournalEntry[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    'This Month': [],
    Older: [],
  };

  for (const entry of entries) {
    const d = new Date(entry.createdAt);
    if (d >= today) groups.Today.push(entry);
    else if (d >= yesterday) groups.Yesterday.push(entry);
    else if (d >= weekAgo) groups['This Week'].push(entry);
    else if (d >= monthAgo) groups['This Month'].push(entry);
    else groups.Older.push(entry);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, entries: items }));
}

export default function JournalSidebar({
  entries,
  agentMap,
  selectedEntryId,
  onSelect,
  isLoading,
}: JournalSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [entries, search]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div
      className="flex shrink-0 flex-col rounded-2xl"
      style={{
        width: 280,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Search */}
      <div className="border-b px-3 py-3" style={{ borderColor: 'var(--divider)' }}>
        <div
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
        >
          <Search size={13} style={{ color: 'var(--text-quaternary)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-[var(--text-quaternary)]"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto px-2 py-2" style={{ scrollbarWidth: 'thin' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Loading...</span>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              {entries.length === 0 ? '📓 No entries yet' : 'No entries match'}
            </span>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-3">
              <div
                className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-quaternary)' }}
              >
                {group.label}
              </div>
              {group.entries.map((entry) => {
                const agent = entry.agentId ? agentMap.get(entry.agentId) : undefined;
                const isSelected = selectedEntryId === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => onSelect(entry.id)}
                    className="flex w-full flex-col rounded-lg px-2.5 py-2 text-left transition-colors"
                    style={{
                      background: isSelected ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    <div
                      className="text-[13px] font-medium leading-snug truncate"
                      style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      {entry.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      {agent && (
                        <div className="flex items-center gap-1">
                          <div
                            className="h-3 w-3 rounded-full flex items-center justify-center text-[7px] font-bold"
                            style={{ background: agent.avatarColor, color: '#fff' }}
                          >
                            {agent.name.charAt(0)}
                          </div>
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            {agent.name}
                          </span>
                        </div>
                      )}
                      {entry.tags.length > 0 && (
                        <span className="text-[10px]" style={{ color: 'var(--text-quaternary)' }}>
                          {entry.tags.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
