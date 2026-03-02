'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CronExpressionParser } from 'cron-parser';
import Card from '@/components/shared/Card';
import type { ScheduledJob } from '@/lib/types';

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

interface WeekGridProps {
  jobs: ScheduledJob[];
}

/* --- Helpers ------------------------------------------------------------ */

/** Get the Monday of the current week. */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/** Short weekday labels. */
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Time row labels from 6 AM to 10 PM, every 2 hours. */
const TIME_ROWS = Array.from({ length: 9 }, (_, i) => {
  const h = 6 + i * 2;
  if (h === 12) return '12 PM';
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
});

const HOUR_START = 6;
const HOUR_END = 22;
const ROW_HEIGHT = 48; // px per 2-hour block
const HOUR_HEIGHT = ROW_HEIGHT / 2; // px per 1 hour

interface PlacedBlock {
  jobId: string;
  title: string;
  color: string;
  dayIndex: number; // 0 = Mon .. 6 = Sun
  hour: number;
  minute: number;
}

/**
 * For each cron job, find all occurrences that fall within the current
 * week (Mon 00:00 -- Sun 23:59) and within the visible time range.
 */
function computeBlocks(jobs: ScheduledJob[]): PlacedBlock[] {
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const blocks: PlacedBlock[] = [];

  for (const job of jobs) {
    if (!job.cronExpression) continue;
    try {
      const expr = CronExpressionParser.parse(job.cronExpression, {
        currentDate: weekStart,
        endDate: weekEnd,
      });

      // Iterate up to 50 occurrences to avoid runaway loops
      let count = 0;
      while (expr.hasNext() && count < 50) {
        const cronDate = expr.next();
        const d = cronDate.toDate();
        if (d >= weekEnd) break;

        const dayIndex = (d.getDay() + 6) % 7; // shift so Mon=0
        const hour = d.getHours();
        const minute = d.getMinutes();

        // Only include if within visible time range
        if (hour >= HOUR_START && hour < HOUR_END) {
          blocks.push({
            jobId: job.id,
            title: job.title,
            color: job.color,
            dayIndex,
            hour,
            minute,
          });
        }
        count++;
      }
    } catch {
      // Invalid cron expression -- skip gracefully
    }
  }

  return blocks;
}

/* --- Job Block ---------------------------------------------------------- */

function JobBlock({ block }: { block: PlacedBlock }) {
  const topOffset = (block.hour - HOUR_START + block.minute / 60) * HOUR_HEIGHT;
  const timeStr = new Date(2000, 0, 1, block.hour, block.minute).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <motion.div
      variants={fadeIn}
      className="absolute left-1 right-1 rounded-lg cursor-pointer overflow-hidden"
      style={{
        top: topOffset,
        height: Math.max(HOUR_HEIGHT - 2, 20),
        background: block.color + '22', // 13% opacity
        borderLeft: `3px solid ${block.color}`,
        padding: '3px 6px',
      }}
      title={`${block.title} at ${timeStr}`}
    >
      <div
        className="truncate text-[10px] font-semibold leading-tight"
        style={{ color: block.color }}
      >
        {block.title}
      </div>
      <div
        className="truncate text-[9px] leading-tight"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {timeStr}
      </div>
    </motion.div>
  );
}

/* --- Main component ----------------------------------------------------- */

export default function WeekGrid({ jobs }: WeekGridProps) {
  const weekStart = useMemo(() => getWeekStart(), []);
  const blocks = useMemo(() => computeBlocks(jobs), [jobs]);

  // Build date labels for each day
  const dayDates = useMemo(() => {
    return DAY_LABELS.map((label, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return {
        label,
        date: d.getDate(),
        isToday:
          d.getFullYear() === new Date().getFullYear() &&
          d.getMonth() === new Date().getMonth() &&
          d.getDate() === new Date().getDate(),
      };
    });
  }, [weekStart]);

  const gridHeight = TIME_ROWS.length * ROW_HEIGHT;

  return (
    <Card padding="sm" className="h-full flex flex-col">
      {/* Column headers */}
      <div className="flex" style={{ borderBottom: '1px solid var(--divider)' }}>
        {/* Gutter for time labels */}
        <div className="w-[56px] shrink-0" />
        {dayDates.map((day, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-0.5 py-2"
          >
            <span
              className="text-[11px] font-medium uppercase tracking-wide"
              style={{ color: day.isToday ? 'var(--accent)' : 'var(--text-tertiary)' }}
            >
              {day.label}
            </span>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold"
              style={{
                background: day.isToday ? 'var(--accent)' : 'transparent',
                color: day.isToday ? 'var(--text-on-accent)' : 'var(--text-primary)',
              }}
            >
              {day.date}
            </span>
          </div>
        ))}
      </div>

      {/* Scrollable grid body */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 240px)' }}
      >
        <div className="relative flex" style={{ height: gridHeight }}>
          {/* Time labels column */}
          <div className="w-[56px] shrink-0 relative">
            {TIME_ROWS.map((label, i) => (
              <div
                key={label}
                className="absolute right-2 text-[10px] font-medium"
                style={{
                  top: i * ROW_HEIGHT - 6,
                  color: 'var(--text-tertiary)',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="flex-1 flex relative">
            {/* Horizontal grid lines */}
            {TIME_ROWS.map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0"
                style={{
                  top: i * ROW_HEIGHT,
                  borderTop: '1px solid var(--divider)',
                }}
              />
            ))}

            {/* Current time indicator */}
            {(() => {
              const now = new Date();
              const h = now.getHours();
              const m = now.getMinutes();
              if (h >= HOUR_START && h < HOUR_END) {
                const top = (h - HOUR_START + m / 60) * HOUR_HEIGHT;
                return (
                  <div
                    className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                    style={{ top }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: 'var(--error)', marginLeft: -4 }}
                    />
                    <div
                      className="flex-1"
                      style={{ borderTop: '2px solid var(--error)' }}
                    />
                  </div>
                );
              }
              return null;
            })()}

            {/* Seven day columns with job blocks */}
            {DAY_LABELS.map((_, dayIdx) => {
              const dayBlocks = blocks.filter((b) => b.dayIndex === dayIdx);
              return (
                <div
                  key={dayIdx}
                  className="flex-1 relative"
                  style={{
                    borderLeft: dayIdx > 0 ? '1px solid var(--divider)' : undefined,
                    height: gridHeight,
                  }}
                >
                  {dayBlocks.map((block, i) => (
                    <JobBlock key={`${block.jobId}-${i}`} block={block} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
