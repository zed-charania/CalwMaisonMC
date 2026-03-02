'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import type { PipelineStage, PipelineItem, Agent } from '@/lib/types';
import PipelineCard from './PipelineCard';

const STAGE_LABELS: Record<PipelineStage, string> = {
  ideas: 'Ideas',
  scripting: 'Scripting',
  thumbnail: 'Thumbnail',
  filming: 'Filming',
  editing: 'Editing',
};

const STAGE_COLORS: Record<PipelineStage, string> = {
  ideas: '#007AFF',
  scripting: '#AF52DE',
  thumbnail: '#FF9500',
  filming: '#34C759',
  editing: '#5856D6',
};

interface PipelineColumnProps {
  stage: PipelineStage;
  items: PipelineItem[];
  agents: Agent[];
}

export default function PipelineColumn({ stage, items, agents }: PipelineColumnProps) {
  const color = STAGE_COLORS[stage];
  const label = STAGE_LABELS[stage];

  const agentMap = new Map(agents.map((a) => [a.id, a]));

  return (
    <div
      className="card flex flex-col rounded-xl"
      style={{ minHeight: 400, padding: 0 }}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: color }}
          />
          <span
            className="text-[14px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {label}
          </span>
          <span
            className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-medium tabular-nums"
            style={{
              background: `${color}18`,
              color: color,
            }}
          >
            {items.length}
          </span>
        </div>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover-surface-strong"
          style={{ color: 'var(--text-tertiary)' }}
          aria-label={`Add item to ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid var(--divider)' }} />

      {/* Droppable Area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto px-3 py-3"
            style={{
              minHeight: 120,
              background: snapshot.isDraggingOver ? 'var(--hover-overlay)' : 'transparent',
              transition: 'background 150ms ease',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            }}
          >
            <div className="flex flex-col gap-2">
              {items.map((pipelineItem, index) => {
                const agent = pipelineItem.ownerAgentId
                  ? agentMap.get(pipelineItem.ownerAgentId)
                  : pipelineItem.ownerAgent;

                return (
                  <Draggable
                    key={pipelineItem.id}
                    draggableId={pipelineItem.id}
                    index={index}
                  >
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          ...dragProvided.draggableProps.style,
                          opacity: dragSnapshot.isDragging ? 0.92 : 1,
                        }}
                      >
                        <PipelineCard
                          item={pipelineItem}
                          agent={agent}
                          index={index}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
