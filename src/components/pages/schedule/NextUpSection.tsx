'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { CronExpressionParser } from 'cron-parser';
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

interface NextUpProps {
  jobs: ScheduledJob[];
}

interface UpcomingJob {
  job: ScheduledJob;
  nextRun: Date;
}

/** Build a human-readable countdown string. */
function formatCountdown(target: Date): string {
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return 'now';

  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  if (days > 1) {
    return target.toLocaleDateString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  }
  if (days === 1) {
    return `tomorrow ${target.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (hours > 0 && minutes > 0) return `in ${hours}h ${minutes}m`;
  if (hours > 0) return `in ${hours}h`;
  if (minutes > 0) return `in ${minutes}m`;
  return 'in <1m';
}

export default function NextUpSection({ jobs }: NextUpProps) {
  const upcoming = useMemo(() => {
    const results: UpcomingJob[] = [];
    const now = new Date();

    for (const job of jobs) {
      if (!job.cronExpression) continue;
      try {
        const expr = CronExpressionParser.parse(job.cronExpression, {
          currentDate: now,
        });
        if (expr.hasNext()) {
          const nextRun = expr.next().toDate();
          results.push({ job, nextRun });
        }
      } catch {
        // Invalid cron -- skip
      }
    }

    results.sort((a, b) => a.nextRun.getTime() - b.nextRun.getTime());
    return results.slice(0, 5);
  }, [jobs]);

  if (upcoming.length === 0) {
    return (
      <Card padding="lg">
        <CardHeader title="Next Up" subtitle="No upcoming runs" />
        <div
          className="flex flex-col items-center py-6"
          style={{ color: 'var(--text-quaternary)' }}
        >
          <Clock size={20} />
          <p className="mt-2 text-[12px]">Nothing scheduled</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader
        title="Next Up"
        subtitle={`${upcoming.length} upcoming`}
      />

      <motion.div
        variants={listContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1"
      >
        {upcoming.map(({ job, nextRun }) => (
          <motion.div
            key={job.id}
            variants={listItem}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover-surface cursor-pointer"
          >
            {/* Colored dot */}
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: job.color }}
            />

            {/* Title */}
            <div className="flex-1 min-w-0">
              <div
                className="text-[13px] font-medium truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {job.title}
              </div>
              <div
                className="text-[11px] font-mono truncate"
                style={{ color: 'var(--text-quaternary)' }}
              >
                {job.cronExpression}
              </div>
            </div>

            {/* Countdown */}
            <div
              className="shrink-0 text-right text-[11px] font-medium"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {formatCountdown(nextRun)}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
}
