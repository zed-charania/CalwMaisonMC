'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useSchedule } from '@/lib/hooks/useSchedule';
import WeekGrid from './WeekGrid';
import AlwaysRunning from './AlwaysRunning';
import NextUpSection from './NextUpSection';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ScheduleView() {
  const { jobs, isLoading } = useSchedule();

  const cronJobs = (jobs ?? []).filter(
    (j) => j.cronExpression && !j.isAlwaysRunning,
  );
  const daemonJobs = (jobs ?? []).filter((j) => j.isAlwaysRunning);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2
          size={24}
          className="animate-spin"
          style={{ color: 'var(--text-tertiary)' }}
        />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5"
        style={{ height: '100%' }}
      >
        <motion.div variants={item}>
          <h1 className="text-title">Schedule</h1>
          <p className="mt-1 text-caption">
            Cron jobs and always-running daemons
          </p>
        </motion.div>
        <motion.div variants={item}>
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-tertiary)' }}
          >
            <span className="text-[32px] leading-none">📅</span>
            <p className="mt-3 text-[14px] font-medium">No scheduled jobs yet</p>
            <p className="mt-1 text-[12px]">
              Create cron jobs or daemons to automate your agent&apos;s work.
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
      style={{ height: '100%' }}
    >
      {/* Page header */}
      <motion.div variants={item}>
        <h1 className="text-title">Schedule</h1>
        <p className="mt-1 text-caption">
          Cron jobs and always-running daemons
        </p>
      </motion.div>

      {/* Main layout: grid + sidebar */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Week grid */}
        <motion.div variants={item} className="flex-1 min-w-0">
          <WeekGrid jobs={cronJobs} />
        </motion.div>

        {/* Right sidebar */}
        <motion.div
          variants={item}
          className="shrink-0 flex flex-col gap-4"
          style={{ width: 320 }}
        >
          <AlwaysRunning jobs={daemonJobs} />
          <NextUpSection jobs={cronJobs} />
        </motion.div>
      </div>
    </motion.div>
  );
}
