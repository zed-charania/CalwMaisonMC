'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Kanban, BookOpen, Activity,
  Command, X,
} from 'lucide-react';
import { useActivity } from '@/lib/hooks/useActivity';
import { usePipeline } from '@/lib/hooks/usePipeline';
import { useJournal } from '@/lib/hooks/useJournal';
import type { PipelineItem, JournalEntry, ActivityEvent } from '@/lib/types';

type SearchCategory = 'all' | 'pipeline' | 'journal' | 'activity';

const categories: { id: SearchCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'activity', label: 'Activity', icon: Activity },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const sectionAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stageColors: Record<string, string> = {
  ideas: 'var(--accent)', scripting: 'var(--purple)',
  thumbnail: 'var(--orange)', filming: 'var(--success)', editing: 'var(--indigo)',
};

const activityTypeColors: Record<string, { bg: string; color: string }> = {
  browser: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  message: { bg: 'var(--success-light)', color: 'var(--success)' },
  workflow: { bg: 'var(--purple-light)', color: 'var(--purple)' },
  file: { bg: 'var(--teal-light)', color: 'var(--teal)' },
  error: { bg: 'var(--error-light)', color: 'var(--error)' },
  task: { bg: 'var(--indigo-light)', color: 'var(--indigo)' },
  memory: { bg: 'var(--orange-light)', color: 'var(--orange)' },
  integration: { bg: 'var(--success-light)', color: 'var(--success)' },
  pipeline: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  schedule: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  journal: { bg: 'var(--purple-light)', color: 'var(--purple)' },
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const { items: pipelineItems } = usePipeline();
  const { entries: journalEntries } = useJournal();
  const { events: activityEvents } = useActivity();

  const lowerQuery = query.toLowerCase().trim();

  const filteredPipeline = useMemo(() => {
    if (!lowerQuery) return [];
    return (pipelineItems ?? []).filter((p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  }, [lowerQuery, pipelineItems]);

  const filteredJournal = useMemo(() => {
    if (!lowerQuery) return [];
    return (journalEntries ?? []).filter((j) =>
      j.title.toLowerCase().includes(lowerQuery) ||
      j.summary.toLowerCase().includes(lowerQuery) ||
      j.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  }, [lowerQuery, journalEntries]);

  const filteredActivity = useMemo(() => {
    if (!lowerQuery) return [];
    return (activityEvents ?? []).filter((a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery)
    );
  }, [lowerQuery, activityEvents]);

  const showPipeline = (activeCategory === 'all' || activeCategory === 'pipeline') && filteredPipeline.length > 0;
  const showJournal = (activeCategory === 'all' || activeCategory === 'journal') && filteredJournal.length > 0;
  const showActivity = (activeCategory === 'all' || activeCategory === 'activity') && filteredActivity.length > 0;
  const visibleResults = showPipeline || showJournal || showActivity;

  return (
    <div className="mx-auto" style={{ maxWidth: 720, paddingTop: 8 }}>
      {/* Search input */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <div
          className="relative flex items-center gap-3"
          style={{
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: '14px 20px',
          }}
        >
          <Search size={20} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pipeline, journal, activity..."
            autoFocus
            className="flex-1 bg-transparent outline-none placeholder:text-[var(--text-quaternary)]"
            style={{ fontSize: '17px', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'var(--divider)' }}>
              <X size={13} style={{ color: 'var(--text-tertiary)' }} />
            </button>
          )}
          <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5" style={{ background: 'var(--divider)', flexShrink: 0 }}>
            <Command size={11} style={{ color: 'var(--text-quaternary)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-quaternary)' }}>K</span>
          </div>
        </div>
      </motion.div>

      {/* Category chips */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="mt-4 flex items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-all"
              style={{
                background: isActive ? 'var(--accent)' : 'var(--bg-secondary)',
                color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <Icon size={13} />{cat.label}
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {!lowerQuery && (
            <motion.div key="recent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-16 text-center">
              <span className="text-[32px] leading-none">🔍</span>
              <div className="mt-5 text-[17px] font-semibold" style={{ color: 'var(--text-primary)' }}>Search your workspace</div>
              <div className="mt-1.5 text-[14px]" style={{ color: 'var(--text-tertiary)', maxWidth: 360 }}>
                Find anything across pipeline, journal, and activity.
              </div>
            </motion.div>
          )}

          {lowerQuery && !visibleResults && (
            <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-16 text-center">
              <span className="text-[32px] leading-none">🔍</span>
              <div className="mt-5 text-[17px] font-semibold" style={{ color: 'var(--text-primary)' }}>No results found</div>
              <div className="mt-1.5 text-[14px]" style={{ color: 'var(--text-tertiary)', maxWidth: 320 }}>
                Nothing matched &ldquo;{query}&rdquo;. Try a different term.
              </div>
            </motion.div>
          )}

          {lowerQuery && visibleResults && (
            <motion.div key="results" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="flex flex-col gap-6">
              {showPipeline && (
                <motion.div variants={sectionAnim}>
                  <SectionHeader icon={Kanban} label="Pipeline" count={filteredPipeline.length} color="var(--accent)" />
                  <div className="mt-2 flex flex-col gap-1">
                    {filteredPipeline.map((p) => (
                      <motion.div key={p.id} variants={item}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--accent-light)' }}>
                          <Kanban size={15} style={{ color: 'var(--accent)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</div>
                          <div className="mt-0.5 text-[12px] truncate" style={{ color: 'var(--text-tertiary)' }}>{p.description}</div>
                        </div>
                        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize"
                          style={{ background: `color-mix(in srgb, ${stageColors[p.stage] || 'var(--accent)'} 12%, transparent)`, color: stageColors[p.stage] || 'var(--accent)' }}>
                          {p.stage}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {showJournal && (
                <motion.div variants={sectionAnim}>
                  <SectionHeader icon={BookOpen} label="Journal" count={filteredJournal.length} color="var(--purple)" />
                  <div className="mt-2 flex flex-col gap-1">
                    {filteredJournal.map((j) => (
                      <motion.div key={j.id} variants={item}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--purple-light)' }}>
                          <BookOpen size={15} style={{ color: 'var(--purple)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{j.title}</div>
                          <div className="mt-0.5 text-[12px] truncate" style={{ color: 'var(--text-tertiary)' }}>{j.summary}</div>
                        </div>
                        <div className="flex gap-1">
                          {j.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                              style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>{tag}</span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {showActivity && (
                <motion.div variants={sectionAnim}>
                  <SectionHeader icon={Activity} label="Activity" count={filteredActivity.length} color="var(--orange)" />
                  <div className="mt-2 flex flex-col gap-1">
                    {filteredActivity.map((event) => {
                      const style = activityTypeColors[event.type] || activityTypeColors.task;
                      return (
                        <motion.div key={event.id} variants={item}
                          className="flex items-center gap-3 rounded-xl px-4 py-3"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: style.bg }}>
                            <Activity size={15} style={{ color: style.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{event.title}</div>
                            <div className="mt-0.5 text-[12px] truncate" style={{ color: 'var(--text-tertiary)' }}>{event.description}</div>
                          </div>
                          <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize"
                            style={{ background: style.bg, color: style.color }}>{event.type}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, label, count, color }: { icon: React.ElementType; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} style={{ color }} />
      <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
      <span className="rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
        style={{ background: 'var(--divider)', color: 'var(--text-tertiary)' }}>{count}</span>
    </div>
  );
}
