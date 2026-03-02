'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle, Timer,
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusPill from '@/components/shared/StatusPill';
import ProgressBar from '@/components/shared/ProgressBar';
import { useOngoing } from '@/lib/hooks/useOngoing';
import type { OngoingTaskState } from '@/lib/types';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stateConfig: Record<OngoingTaskState, {
  color: string;
  bg: string;
  emoji: string;
  showDot: boolean;
  progressColor: string;
}> = {
  thinking: { color: 'var(--purple)', bg: 'var(--purple-light)', emoji: '\u{1F9E0}', showDot: true, progressColor: 'var(--purple)' },
  waiting_input: { color: 'var(--warning)', bg: 'var(--warning-light)', emoji: '\u{1F4AC}', showDot: true, progressColor: 'var(--warning)' },
  browser_running: { color: 'var(--accent)', bg: 'var(--accent-light)', emoji: '\u{1F310}', showDot: true, progressColor: 'var(--accent)' },
  executing: { color: 'var(--indigo)', bg: 'var(--indigo-light)', emoji: '\u2699\uFE0F', showDot: true, progressColor: 'var(--indigo)' },
  completed: { color: 'var(--success)', bg: 'var(--success-light)', emoji: '\u2705', showDot: false, progressColor: 'var(--success)' },
  failed: { color: 'var(--error)', bg: 'var(--error-light)', emoji: '\u274C', showDot: false, progressColor: 'var(--error)' },
  queued: { color: 'var(--text-tertiary)', bg: 'var(--neutral-subtle)', emoji: '\u{1F550}', showDot: false, progressColor: 'var(--text-quaternary)' },
};

export default function OngoingTasksPage() {
  const { tasks: ongoingTasks, isLoading } = useOngoing();

  const allTasks = ongoingTasks ?? [];
  const activeTasks = allTasks.filter((t) => t.state !== 'queued' && t.state !== 'completed' && t.state !== 'failed');
  const queueAndHistory = allTasks.filter((t) => t.state === 'queued' || t.state === 'completed' || t.state === 'failed');

  const activeCount = activeTasks.length;
  const queuedCount = allTasks.filter((t) => t.state === 'queued').length;
  const completedTodayCount = allTasks.filter((t) => t.state === 'completed').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5">
      <motion.div variants={item}>
        <h1 className="text-title">Live Tasks</h1>
        <p className="mt-1 text-caption">Monitor tasks currently being executed by OpenClaw</p>
      </motion.div>

      {/* Summary Bar */}
      <motion.div variants={item}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active', value: activeCount, emoji: '\u26A1', color: 'var(--accent)', bg: 'var(--accent-light)' },
            { label: 'Queued', value: queuedCount, emoji: '\u{1F550}', color: 'var(--warning)', bg: 'var(--warning-light)' },
            { label: 'Completed today', value: completedTodayCount, emoji: '\u2705', color: 'var(--success)', bg: 'var(--success-light)' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border px-5 py-4"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: stat.bg }}>
                <span className="text-[18px] leading-none">{stat.emoji}</span>
              </div>
              <div>
                <div className="text-[22px] font-semibold tabular-nums tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {stat.value}
                </div>
                <div className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Active Section */}
      {activeTasks.length > 0 && (
        <motion.div variants={item}>
          <div className="mb-3"><span className="text-label">Active</span></div>
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
            {activeTasks.map((task) => {
              const config = stateConfig[task.state];
              return (
                <motion.div key={task.id} variants={item}>
                  <Card padding="lg" hoverable>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: config.bg }}>
                        <span className="text-[18px] leading-none">{config.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-[14px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{task.title}</h3>
                          <StatusPill variant={task.state} showDot={config.showDot} size="md" />
                        </div>
                        <p className="mt-1 text-[13px]" style={{ color: 'var(--text-secondary)' }}>{task.currentStep}</p>
                        <div className="mt-3"><ProgressBar progress={task.progress} color={config.progressColor} showLabel /></div>
                        <div className="mt-3 flex items-center gap-4 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                            <Timer size={10} />Started {task.startedAt}
                          </span>
                          {task.estimatedCompletion && (
                            <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                              ETA: {task.estimatedCompletion}
                            </span>
                          )}
                        </div>
                        {task.blockers && task.blockers.length > 0 && (
                          <div className="mt-3 flex flex-col gap-1.5">
                            {task.blockers.map((blocker, i) => (
                              <div key={i} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
                                style={{ background: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid rgba(255, 159, 10, 0.15)' }}>
                                <AlertTriangle size={11} />{blocker}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Queue & History */}
      {queueAndHistory.length > 0 && (
        <motion.div variants={item}>
          <div className="mb-3"><span className="text-label">Queue & History</span></div>
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
            {queueAndHistory.map((task) => {
              const config = stateConfig[task.state];
              return (
                <motion.div key={task.id} variants={item}>
                  <Card padding="md">
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: config.bg }}>
                        <span className="text-[16px] leading-none">{config.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-[13px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{task.title}</h3>
                          <StatusPill variant={task.state} />
                        </div>
                        <p className="mt-0.5 text-[12px] truncate" style={{ color: 'var(--text-tertiary)' }}>{task.currentStep}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        {task.progress > 0 && task.progress < 100 && (
                          <div className="w-20"><ProgressBar progress={task.progress} color={config.progressColor} showLabel height={3} /></div>
                        )}
                        {task.progress === 100 && <span className="text-[11px] font-medium" style={{ color: 'var(--success)' }}>Done</span>}
                        {task.progress === 0 && task.state === 'queued' && <span className="text-[11px]" style={{ color: 'var(--text-quaternary)' }}>Pending</span>}
                        <div className="mt-0.5 text-[10px] tabular-nums" style={{ color: 'var(--text-quaternary)' }}>{task.startedAt}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Empty state */}
      {allTasks.length === 0 && !isLoading && (
        <motion.div variants={item}>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-tertiary)' }}>
            <span className="text-[32px] leading-none">{'\u26A1'}</span>
            <p className="mt-3 text-[14px] font-medium">No live tasks. Jobs will appear here in real time when your agent is working.</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
