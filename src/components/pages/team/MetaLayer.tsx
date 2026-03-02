'use client';

import { Network, Zap, Brain, MessageSquare } from 'lucide-react';
import Card, { CardHeader } from '@/components/shared/Card';

interface MetaLayerProps {
  agentCount: number;
}

export default function MetaLayer({ agentCount }: MetaLayerProps) {
  const capabilities = [
    {
      icon: Network,
      label: 'Multi-Agent Orchestration',
      description: `${agentCount} agents coordinating tasks through structured signal flows`,
      color: 'var(--accent)',
      bg: 'var(--accent-light)',
    },
    {
      icon: Brain,
      label: 'Shared Knowledge Base',
      description: 'Agents share context through the journal and knowledge store',
      color: 'var(--purple)',
      bg: 'var(--purple-light)',
    },
    {
      icon: MessageSquare,
      label: 'Inter-Agent Communication',
      description: 'Input signals and output actions form a directed communication graph',
      color: 'var(--teal)',
      bg: 'var(--teal-light)',
    },
    {
      icon: Zap,
      label: 'Autonomous Execution',
      description: 'Agents execute assigned tasks with minimal human intervention',
      color: 'var(--orange)',
      bg: 'var(--orange-light)',
    },
  ];

  return (
    <Card padding="lg">
      <CardHeader
        title="System Capabilities"
        subtitle="How the agent team collaborates"
      />
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {capabilities.map((cap) => (
          <div
            key={cap.label}
            className="flex items-start gap-3 rounded-xl border p-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: cap.bg }}
            >
              <cap.icon size={17} style={{ color: cap.color }} />
            </div>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {cap.label}
              </div>
              <div className="mt-0.5 text-[12px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {cap.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
