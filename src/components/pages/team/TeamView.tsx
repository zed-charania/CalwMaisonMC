'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useAgents } from '@/lib/hooks/useAgents';
import AgentCard from './AgentCard';
import MetaLayer from './MetaLayer';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function TeamView() {
  const { agents, isLoading } = useAgents();

  const parentAgent = (agents ?? []).find((a) => !a.parentAgentId);
  const childAgents = (agents ?? []).filter((a) => a.parentAgentId);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-title">Team</h1>
        <p className="mt-1 text-caption">
          Your AI agent team hierarchy, roles, and signal flows.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'var(--accent-light)' }}
          >
            <Users size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {(agents ?? []).length}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Total Agents</div>
          </div>
        </div>
        <div className="h-8 w-px" style={{ background: 'var(--divider)' }} />
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'var(--success-light)' }}
          >
            <div className="h-2 w-2 rounded-full pulse-dot" style={{ background: 'var(--success)' }} />
          </div>
          <div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {(agents ?? []).filter((a) => a.status === 'active' || a.status === 'online').length}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Active</div>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div variants={item}>
          <div className="flex items-center justify-center py-16">
            <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Loading team...</span>
          </div>
        </motion.div>
      ) : (agents ?? []).length === 0 ? (
        <motion.div variants={item}>
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            <span className="text-[32px] leading-none">👥</span>
            <p className="mt-3 text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              No agents yet
            </p>
            <p className="mt-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              Register agents via the API to build your team.
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Orchestrator */}
          {parentAgent && (
            <motion.div variants={item}>
              <div className="mb-3">
                <span className="text-label">Orchestrator</span>
              </div>
              <AgentCard agent={parentAgent} isOrchestrator />
            </motion.div>
          )}

          {/* Team members grid */}
          {childAgents.length > 0 && (
            <motion.div variants={item}>
              <div className="mb-3">
                <span className="text-label">Specialist Agents</span>
              </div>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
              >
                {childAgents.map((agent) => (
                  <motion.div key={agent.id} variants={item}>
                    <AgentCard agent={agent} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Meta layer */}
          <motion.div variants={item}>
            <MetaLayer agentCount={(agents ?? []).length} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
