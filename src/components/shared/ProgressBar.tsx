'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  color = 'var(--accent)',
  height = 4,
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative flex-1 overflow-hidden rounded-full"
        style={{ height, background: 'var(--divider)' }}
      >
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: color }}
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-medium tabular-nums" style={{ color: 'var(--text-tertiary)', minWidth: 32 }}>
          {progress}%
        </span>
      )}
    </div>
  );
}
