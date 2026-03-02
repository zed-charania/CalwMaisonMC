'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  emoji: string;
  href: string;
  category: string;
}

const commands: CommandItem[] = [
  { id: 'nav-overview', label: 'Overview', description: 'System dashboard', emoji: '📊', href: '/overview', category: 'Navigation' },
  { id: 'nav-pipeline', label: 'Pipeline', description: 'Content pipeline board', emoji: '🎬', href: '/pipeline', category: 'Navigation' },
  { id: 'nav-schedule', label: 'Schedule', description: 'Scheduled tasks & cron jobs', emoji: '📅', href: '/schedule', category: 'Navigation' },
  { id: 'nav-ongoing', label: 'Ongoing Tasks', description: 'Live active jobs', emoji: '🔴', href: '/ongoing', category: 'Navigation' },
  { id: 'nav-journal', label: 'Journal', description: 'Agent journal & notes', emoji: '📓', href: '/journal', category: 'Navigation' },
  { id: 'nav-search', label: 'Search', description: 'Search everything', emoji: '🔍', href: '/search', category: 'Navigation' },
  { id: 'nav-files', label: 'Files', description: 'Documents and files', emoji: '📁', href: '/files', category: 'Navigation' },
  { id: 'nav-workflows', label: 'Workflows', description: 'Automations', emoji: '⚡', href: '/workflows', category: 'Navigation' },
  { id: 'nav-activity', label: 'Activity', description: 'Event timeline', emoji: '📡', href: '/activity', category: 'Navigation' },
  { id: 'nav-api', label: 'API Usage', description: 'Cost tracking', emoji: '💰', href: '/api-usage', category: 'Navigation' },
  { id: 'nav-team', label: 'Team', description: 'Agent team & hierarchy', emoji: '👥', href: '/team', category: 'Navigation' },
  { id: 'nav-integrations', label: 'Integrations', description: 'Connected services', emoji: '🧩', href: '/integrations', category: 'Navigation' },
  { id: 'nav-settings', label: 'Settings', description: 'Configuration', emoji: '⚙️', href: '/settings', category: 'Navigation' },
  { id: 'action-new-item', label: 'Add Pipeline Item', description: 'Add content to the pipeline', emoji: '🎬', href: '/pipeline', category: 'Actions' },
  { id: 'action-search-journal', label: 'Search Journal', description: 'Find in agent journal', emoji: '📓', href: '/journal', category: 'Actions' },
  { id: 'action-run-workflow', label: 'Run Workflow', description: 'Execute an automation', emoji: '⚡', href: '/workflows', category: 'Actions' },
  { id: 'action-new-doc', label: 'Create Document', description: 'Generate a new file', emoji: '📄', href: '/files', category: 'Actions' },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const categories = [...new Set(filtered.map((c) => c.category))];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        router.push(filtered[selectedIndex].href);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selectedIndex, onClose, router]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50"
            style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-[560px] -translate-x-1/2 overflow-hidden rounded-2xl border"
            style={{
              background: 'linear-gradient(135deg, var(--glass-tint), var(--glass-bg-strong))',
              backdropFilter: 'blur(var(--glass-blur-strong)) saturate(var(--glass-saturation))',
              WebkitBackdropFilter: 'blur(var(--glass-blur-strong)) saturate(var(--glass-saturation))',
              borderColor: 'var(--glass-border)',
              boxShadow: 'var(--glass-inner-shadow), var(--shadow-xl)',
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <Search size={18} style={{ color: 'var(--text-quaternary)' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands, pages, actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--text-quaternary)]"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto p-2">
              {categories.map((cat) => (
                <div key={cat}>
                  <div
                    className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-quaternary)' }}
                  >
                    {cat}
                  </div>
                  {filtered
                    .filter((c) => c.category === cat)
                    .map((item) => {
                      flatIndex++;
                      const idx = flatIndex;
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { router.push(item.href); onClose(); }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors"
                          style={{
                            background: isSelected ? 'var(--accent-light)' : 'transparent',
                          }}
                        >
                          <span className="text-[15px] leading-none shrink-0">
                            {item.emoji}
                          </span>
                          <div className="flex-1">
                            <div className="text-[13px] font-medium" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                                {item.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
