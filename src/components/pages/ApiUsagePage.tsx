'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import Card, { CardHeader } from '@/components/shared/Card';
import ProgressBar from '@/components/shared/ProgressBar';
import type { UsageDataPoint, ModelUsage } from '@/lib/types';

// Static for now - will be replaced with API tracking
const usageData: UsageDataPoint[] = [];
const modelUsage: ModelUsage[] = [];
const usageStats = {
  today: { tokens: 0, cost: 0, requests: 0 },
  thisWeek: { tokens: 0, cost: 0, requests: 0 },
  thisMonth: { tokens: 0, cost: 0, requests: 0 },
  burnRate: { daily: 0, monthly: 0 },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const modelColors: Record<string, string> = {
  'Claude Opus 4': 'var(--purple)',
  'Claude Sonnet 4': 'var(--accent)',
  'Claude Haiku 3.5': 'var(--teal)',
  'GPT-4o': 'var(--success)',
};

const modelBgs: Record<string, string> = {
  'Claude Opus 4': 'var(--purple-light)',
  'Claude Sonnet 4': 'var(--accent-light)',
  'Claude Haiku 3.5': 'var(--teal-light)',
  'GPT-4o': 'var(--success-light)',
};

const statCards = [
  {
    label: 'Total Cost This Month',
    value: `$${usageStats.thisMonth.cost.toFixed(2)}`,
    emoji: '💰',
    bg: 'var(--accent-light)',
  },
  {
    label: 'Total Tokens',
    value: `${(usageStats.thisMonth.tokens / 1_000_000).toFixed(1)}M`,
    emoji: '🪙',
    bg: 'var(--purple-light)',
  },
  {
    label: 'Daily Average Cost',
    value: `$${usageStats.burnRate.daily.toFixed(2)}`,
    emoji: '📈',
    bg: 'var(--success-light)',
  },
  {
    label: 'Requests This Month',
    value: usageStats.thisMonth.requests.toLocaleString(),
    emoji: '📡',
    bg: 'var(--orange-light)',
  },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{
        background: 'var(--bg-elevated)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span
          className="text-[16px] font-semibold tabular-nums"
          style={{ color: 'var(--text-primary)' }}
        >
          ${payload[0].value.toFixed(2)}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          cost
        </span>
      </div>
      <div className="mt-0.5 text-[11px] tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
        {(payload[0].payload.tokens / 1000).toFixed(0)}K tokens
      </div>
    </div>
  );
}

export default function ApiUsagePage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Page header */}
      <motion.div variants={item}>
        <h1 className="text-title">API Usage</h1>
        <p className="mt-1 text-caption">
          Track token consumption, costs, and model usage across your workspace.
        </p>
      </motion.div>

      {/* Top stats row */}
      <motion.div
        variants={item}
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
      >
        {statCards.map((stat) => (
          <Card key={stat.label} padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {stat.label}
                </div>
                <div
                  className="mt-2 text-[24px] font-semibold tabular-nums tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {stat.value}
                </div>
              </div>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: stat.bg }}
              >
                <span className="text-[18px] leading-none">{stat.emoji}</span>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Daily cost chart */}
      <motion.div variants={item}>
        <Card padding="lg">
          <CardHeader
            title="Daily Cost Trend"
            subtitle="Last 7 days"
          />
          <div style={{ width: '100%', height: 280 }}>
            {usageData.length === 0 ? (
              <div className="flex h-full items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                <p className="text-[13px]">📊 No usage data yet. Costs will chart here once your agent makes API calls.</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={usageData}
                margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                  tickFormatter={(v) => `$${v}`}
                  dx={-4}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#costGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: 'var(--accent)',
                    stroke: 'var(--bg-secondary)',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Bottom row: Model breakdown + Cost breakdown + Burn estimate */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        {/* Model breakdown */}
        <motion.div variants={item}>
          <Card padding="lg" className="h-full">
            <CardHeader title="Model Breakdown" subtitle="Token usage by model" />
            <div className="flex flex-col gap-5">
              {modelUsage.length === 0 ? (
                <p className="py-6 text-center text-[13px]" style={{ color: 'var(--text-tertiary)' }}>🪙 No model usage yet.</p>
              ) : modelUsage.map((model) => {
                const color = modelColors[model.model] || 'var(--accent)';
                const bg = modelBgs[model.model] || 'var(--accent-light)';
                return (
                  <div key={model.model}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: color }}
                        />
                        <span
                          className="text-[13px] font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {model.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className="text-[12px] tabular-nums"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {(model.tokens / 1000).toFixed(0)}K tokens
                        </span>
                        <span
                          className="text-[13px] font-semibold tabular-nums"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          ${model.cost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <ProgressBar
                      progress={model.percentage}
                      color={color}
                      height={6}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Right column: Cost breakdown + Estimated burn */}
        <div className="flex flex-col gap-5">
          {/* Cost breakdown */}
          <motion.div variants={item}>
            <Card padding="lg">
              <CardHeader title="Cost Breakdown" />
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Today', cost: usageStats.today.cost, tokens: usageStats.today.tokens, requests: usageStats.today.requests },
                  { label: 'This Week', cost: usageStats.thisWeek.cost, tokens: usageStats.thisWeek.tokens, requests: usageStats.thisWeek.requests },
                  { label: 'This Month', cost: usageStats.thisMonth.cost, tokens: usageStats.thisMonth.tokens, requests: usageStats.thisMonth.requests },
                ].map((period) => (
                  <div
                    key={period.label}
                    className="flex items-center justify-between rounded-xl border px-4 py-3"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div>
                      <div
                        className="text-[13px] font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {period.label}
                      </div>
                      <div
                        className="mt-0.5 text-[11px]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {(period.tokens / 1000).toFixed(0)}K tokens &middot; {period.requests} requests
                      </div>
                    </div>
                    <span
                      className="text-[16px] font-semibold tabular-nums"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      ${period.cost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Estimated monthly burn callout */}
          <motion.div variants={item}>
            <div
              className="rounded-2xl border px-6 py-5"
              style={{
                borderColor: 'var(--border)',
                background: 'linear-gradient(135deg, var(--orange-light) 0%, var(--error-light) 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(255, 149, 0, 0.15)' }}
                >
                  <span className="text-[20px] leading-none">🔥</span>
                </div>
                <div>
                  <div
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--orange)' }}
                  >
                    Estimated Monthly Burn
                  </div>
                  <div
                    className="mt-0.5 text-[12px]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Based on your daily average
                  </div>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[32px] font-bold tabular-nums tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ${usageStats.burnRate.monthly.toFixed(2)}
                </span>
                <span
                  className="text-[14px] font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  / month
                </span>
              </div>
              <div
                className="mt-2 text-[12px]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Daily average: ${usageStats.burnRate.daily.toFixed(2)}/day
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
