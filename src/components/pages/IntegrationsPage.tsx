'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link, Unlink,
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusPill from '@/components/shared/StatusPill';
import type { Integration, IntegrationStatus } from '@/lib/types';

// Static for now - will be replaced with API
const integrations: Integration[] = [];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const integrationEmojis: Record<string, string> = {
  Gmail: '✉️',
  'Google Calendar': '📅',
  Slack: '💬',
  Notion: '📝',
  'Google Drive': '💾',
  GitHub: '🐙',
  Linear: '📋',
  Airtable: '🗄️',
  Salesforce: '👥',
  Stripe: '💳',
};

const avatarColors: Record<string, string> = {
  Gmail: '#EA4335',
  'Google Calendar': '#4285F4',
  Slack: '#E01E5A',
  Notion: '#000000',
  'Google Drive': '#0F9D58',
  GitHub: '#24292F',
  Linear: '#5E6AD2',
  Airtable: '#18BFFF',
  Salesforce: '#00A1E0',
  Stripe: '#635BFF',
};

const categories = ['All', 'Communication', 'Productivity', 'Engineering', 'Sales', 'Finance', 'Storage'] as const;

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = selectedCategory === 'All'
    ? integrations
    : integrations.filter((i) => i.category === selectedCategory);

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;
  const syncingCount = integrations.filter((i) => i.status === 'syncing').length;

  // Group filtered integrations by category
  const grouped = filtered.reduce<Record<string, Integration[]>>((acc, integration) => {
    const cat = integration.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(integration);
    return acc;
  }, {});

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <h1 className="text-title">Integrations</h1>
        <p className="text-caption mt-1">Manage connected services and data sources.</p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="mt-5 flex items-center gap-6"
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'var(--success-light)' }}
          >
            <span className="text-[14px] leading-none">🔗</span>
          </div>
          <div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {connectedCount}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Connected</div>
          </div>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: 'var(--divider)' }}
        />
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'var(--neutral-subtle)' }}
          >
            <span className="text-[14px] leading-none">🧩</span>
          </div>
          <div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {integrations.length}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Total</div>
          </div>
        </div>
        <div
          className="h-8 w-px"
          style={{ background: 'var(--divider)' }}
        />
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'var(--accent-light)' }}
          >
            <span className="text-[14px] leading-none">🔄</span>
          </div>
          <div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {syncingCount}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Syncing</div>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="mt-5 flex items-center gap-2"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all"
            style={{
              background: selectedCategory === cat ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: selectedCategory === cat ? 'var(--bg-secondary)' : 'var(--text-secondary)',
              border: `1px solid ${selectedCategory === cat ? 'var(--text-primary)' : 'var(--border)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Integration Groups */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {integrations.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-tertiary)' }}
            >
              <p className="text-[14px] font-medium">🧩 No integrations yet. Connect services to extend your agent&apos;s capabilities.</p>
            </div>
          ) : Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-8 last:mb-0">
              {selectedCategory === 'All' && (
                <div
                  className="mb-3 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
                >
                  {category}
                </div>
              )}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
              >
                {items.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


function IntegrationCard({ integration }: { integration: Integration }) {
  const emoji = integrationEmojis[integration.name] || '🧩';
  const color = avatarColors[integration.name] || 'var(--accent)';
  const isConnected = integration.status === 'connected' || integration.status === 'syncing';

  return (
    <motion.div variants={item}>
      <Card padding="lg" hoverable>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: color }}
            >
              <span className="text-[18px] leading-none">{emoji}</span>
            </div>
            <div>
              <div className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {integration.name}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {integration.description}
              </div>
            </div>
          </div>
        </div>

        {/* Status + Last Sync */}
        <div className="mt-4 flex items-center justify-between">
          <StatusPill
            variant={integration.status}
            showDot={integration.status === 'syncing'}
          />
          {integration.lastSync && (
            <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-quaternary)' }}>
              Synced {integration.lastSync}
            </span>
          )}
        </div>

        {/* Permissions */}
        {integration.permissions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {integration.permissions.map((perm) => (
              <span
                key={perm}
                className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {perm}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <button
            className="w-full rounded-lg py-2 text-[12px] font-semibold transition-all"
            style={{
              background: isConnected ? 'var(--bg-tertiary)' : 'var(--accent)',
              color: isConnected ? 'var(--text-secondary)' : 'var(--text-on-accent)',
              border: `1px solid ${isConnected ? 'var(--border)' : 'var(--accent)'}`,
            }}
          >
            {isConnected ? (
              <span className="flex items-center justify-center gap-1.5">
                <Unlink size={12} />
                Disconnect
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <Link size={12} />
                Connect
              </span>
            )}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
