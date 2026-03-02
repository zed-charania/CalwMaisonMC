'use client';

import { ArrowRight } from 'lucide-react';
import StatusPill from '@/components/shared/StatusPill';
import Card from '@/components/shared/Card';
import type { Agent } from '@/lib/types';

interface AgentCardProps {
  agent: Agent;
  isOrchestrator?: boolean;
}

export default function AgentCard({ agent, isOrchestrator = false }: AgentCardProps) {
  return (
    <Card padding="lg" hoverable>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="flex shrink-0 items-center justify-center rounded-2xl text-[18px] font-bold"
          style={{
            width: isOrchestrator ? 52 : 44,
            height: isOrchestrator ? 52 : 44,
            background: agent.avatarColor,
            color: '#ffffff',
          }}
        >
          {agent.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + Status */}
          <div className="flex items-center gap-2.5">
            <h3
              className="font-semibold truncate"
              style={{
                color: 'var(--text-primary)',
                fontSize: isOrchestrator ? '17px' : '15px',
                letterSpacing: '-0.01em',
              }}
            >
              {agent.name}
            </h3>
            <StatusPill variant={agent.status} showDot size="sm" />
          </div>

          {/* Role */}
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            {agent.role}
          </p>

          {/* Trait pills */}
          {agent.traits.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {agent.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ background: 'var(--neutral-subtle)', color: 'var(--text-secondary)' }}
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Signal flow */}
      {(agent.inputSignals.length > 0 || agent.outputActions.length > 0) && (
        <div className="mt-4">
          <div style={{ borderTop: '1px solid var(--divider)' }} className="pt-3">
            <div className="flex gap-3">
              {/* Inputs */}
              <div className="flex-1 min-w-0">
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-quaternary)' }}>
                  Input Signals
                </div>
                <div className="flex flex-col gap-1">
                  {agent.inputSignals.map((signal) => (
                    <div
                      key={signal}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                    >
                      <div className="h-1 w-1 rounded-full" style={{ background: 'var(--accent)' }} />
                      {signal}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center shrink-0 px-1">
                <ArrowRight size={16} style={{ color: 'var(--text-quaternary)' }} />
              </div>

              {/* Outputs */}
              <div className="flex-1 min-w-0">
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-quaternary)' }}>
                  Output Actions
                </div>
                <div className="flex flex-col gap-1">
                  {agent.outputActions.map((action) => (
                    <div
                      key={action}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]"
                      style={{ background: 'var(--success-light)', color: 'var(--success)' }}
                    >
                      <div className="h-1 w-1 rounded-full" style={{ background: 'var(--success)' }} />
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
