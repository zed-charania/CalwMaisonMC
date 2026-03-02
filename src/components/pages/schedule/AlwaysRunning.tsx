'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import Card, { CardHeader } from '@/components/shared/Card';
import type { ScheduledJob } from '@/lib/types';

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const listItem = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

interface AlwaysRunningProps {
  jobs: ScheduledJob[];
}

/** Generate a deterministic simulated uptime string based on job creation date. */
function getSimulatedUptime(createdAt: string): string {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMs = Math.max(now - created, 0);
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function AlwaysRunning({ jobs }: AlwaysRunningProps) {
  const uptimes = useMemo(
    () => jobs.map((j) => getSimulatedUptime(j.createdAt)),
    [jobs],
  );

  if (jobs.length === 0) {
    return (
      <Card padding="lg">
        <CardHeader title="Always Running" subtitle="No daemons" />
        <div
          className="flex flex-col items-center py-6"
          style={{ color: 'var(--text-quaternary)' }}
        >
          <Activity size={20} />
          <p className="mt-2 text-[12px]">No persistent tasks</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader
        title="Always Running"
        subtitle={`${jobs.length} daemon${jobs.length !== 1 ? 's' : ''}`}
      />

      <motion.div
        variants={listContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1"
      >
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            variants={listItem}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover-surface cursor-pointer"
          >
            {/* Colored pulsing dot */}
            <div className="relative flex items-center justify-center">
              <div
                className="h-2.5 w-2.5 rounded-full pulse-dot"
                style={{ background: job.color }}
              />
            </div>

            {/* Title and status */}
            <div className="flex-1 min-w-0">
              <div
                className="text-[13px] font-medium truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {job.title}
              </div>
              <div
                className="text-[11px] truncate"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {job.status}
              </div>
            </div>

            {/* Uptime */}
            <div
              className="shrink-0 text-[11px] tabular-nums font-medium"
              style={{ color: 'var(--text-quaternary)' }}
            >
              {uptimes[i]}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
}
