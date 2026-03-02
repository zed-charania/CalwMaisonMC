'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJournal } from '@/lib/hooks/useJournal';
import { useAgents } from '@/lib/hooks/useAgents';
import JournalSidebar from './JournalSidebar';
import JournalDetail from './JournalDetail';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function JournalView() {
  const { entries, isLoading } = useJournal();
  const { agents } = useAgents();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const agentMap = new Map((agents ?? []).map((a) => [a.id, a]));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-title">Journal</h1>
        <p className="mt-1 text-caption">Agent decision logs, observations, and notes.</p>
      </motion.div>

      {/* Split pane */}
      <motion.div variants={item} className="flex gap-5" style={{ minHeight: 560 }}>
        {/* Sidebar */}
        <JournalSidebar
          entries={entries ?? []}
          agentMap={agentMap}
          selectedEntryId={selectedEntryId}
          onSelect={setSelectedEntryId}
          isLoading={isLoading}
        />

        {/* Detail */}
        <div className="flex-1 min-w-0">
          {selectedEntryId ? (
            <JournalDetail entryId={selectedEntryId} agentMap={agentMap} />
          ) : (
            <div
              className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed"
              style={{ borderColor: 'var(--border-strong)' }}
            >
              <span className="text-[32px] leading-none">📓</span>
              <p className="mt-3 text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                Select a journal entry from the sidebar, or wait for your agent to write one.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
