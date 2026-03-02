'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Clock, Play, Zap, Timer,
} from 'lucide-react';
import Card, { CardHeader } from '@/components/shared/Card';
import { useWorkflows } from '@/lib/hooks/useWorkflows';
import type { Workflow } from '@/lib/types';

type WorkflowFilter = 'all' | 'active' | 'inactive';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function WorkflowsPage() {
  const { workflows: workflowsData } = useWorkflows();
  const [filter, setFilter] = useState<WorkflowFilter>('all');

  const workflows = workflowsData ?? [];

  const filteredWorkflows = useMemo(() => {
    if (filter === 'active') return workflows.filter((w: Workflow) => w.active);
    if (filter === 'inactive') return workflows.filter((w: Workflow) => !w.active);
    return workflows;
  }, [filter, workflows]);

  const activeCount = workflows.filter((w: Workflow) => w.active).length;
  const totalRunsToday = workflows.reduce((sum: number, w: Workflow) => sum + w.totalRuns, 0);
  const avgSuccessRate =
    workflows.length > 0
      ? Math.round(workflows.reduce((sum: number, w: Workflow) => sum + w.successRate, 0) / workflows.length)
      : 0;

  const stats = [
    { label: 'Total Workflows', value: workflows.length, emoji: '⚡', bg: 'var(--accent-light)' },
    { label: 'Active', value: activeCount, emoji: '▶️', bg: 'var(--success-light)' },
    { label: 'Total Runs', value: totalRunsToday, emoji: '📊', bg: 'var(--purple-light)' },
    { label: 'Avg. Success Rate', value: workflows.length > 0 ? `${avgSuccessRate}%` : '—', emoji: '✅', bg: 'var(--success-light)' },
  ];

  const filters: { id: WorkflowFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-title">Workflows</h1>
          <p className="mt-1 text-caption">Manage your automated workflows and triggers.</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-all"
          style={{
            background: 'var(--accent)',
            color: 'var(--text-on-accent)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Plus size={16} />
          New Workflow
        </button>
      </motion.div>

      {/* Stats bar */}
      <motion.div variants={item} className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: stat.bg }}
              >
                <span className="text-[17px] leading-none">{stat.emoji}</span>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  {stat.label}
                </div>
                <div className="text-[20px] font-semibold tabular-nums tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={item} className="flex items-center gap-2">
        {filters.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all"
              style={{
                background: isActive ? 'var(--accent)' : 'var(--bg-secondary)',
                color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: isActive ? 'none' : 'var(--shadow-xs)',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </motion.div>

      {/* Workflow cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        {filteredWorkflows.length === 0 ? (
          <motion.div variants={item} className="col-span-2">
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-tertiary)' }}
            >
              <p className="text-[14px] font-medium">⚡ No workflows yet. Create automations to let your agent work on autopilot.</p>
            </div>
          </motion.div>
        ) : (
          filteredWorkflows.map((workflow) => (
            <motion.div key={workflow.id} variants={item}>
              <WorkflowCard workflow={workflow} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Sub-components ---------- */

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isCron = /daily|every|friday/i.test(workflow.trigger);

  return (
    <Card hoverable padding="lg">
      {/* Top: Name + Status dot */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="text-[15px] font-semibold truncate" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {workflow.name}
            </div>
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: workflow.active ? 'var(--success)' : 'var(--text-quaternary)' }}
            />
          </div>
          <div className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {workflow.description}
          </div>
        </div>

        {/* Toggle switch */}
        <div
          className="shrink-0 rounded-full"
          style={{
            width: 40,
            height: 24,
            padding: 2,
            background: workflow.active ? 'var(--success)' : 'var(--text-quaternary)',
            transition: 'background 200ms ease',
            cursor: 'pointer',
          }}
        >
          <div
            className="h-5 w-5 rounded-full"
            style={{
              background: 'var(--text-on-accent)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              transform: workflow.active ? 'translateX(16px)' : 'translateX(0)',
              transition: 'transform 200ms ease',
            }}
          />
        </div>
      </div>

      {/* Trigger + steps */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{
            background: isCron ? 'var(--purple-light)' : 'var(--accent-light)',
            color: isCron ? 'var(--purple)' : 'var(--accent)',
          }}
        >
          {isCron ? <Clock size={10} /> : <Zap size={10} />}
          {isCron ? 'Cron' : 'Event'}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
          {workflow.trigger}
        </span>
        <span style={{ color: 'var(--text-quaternary)' }}>&middot;</span>
        <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
          {workflow.steps} steps
        </span>
      </div>

      {/* Divider */}
      <div className="my-3" style={{ borderBottom: '1px solid var(--divider)' }} />

      {/* Timestamps */}
      <div className="flex items-center gap-4">
        {workflow.lastRun && (
          <div className="flex items-center gap-1.5">
            <Timer size={12} style={{ color: 'var(--text-quaternary)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              Last: {workflow.lastRun}
            </span>
          </div>
        )}
        {workflow.nextRun && (
          <div className="flex items-center gap-1.5">
            <Play size={12} style={{ color: 'var(--text-quaternary)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              Next: {workflow.nextRun}
            </span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
          {workflow.totalRuns} total runs
        </span>
        <span className="text-[13px] font-semibold tabular-nums" style={{ color: 'var(--success)' }}>
          {workflow.successRate}% success
        </span>
      </div>
    </Card>
  );
}
