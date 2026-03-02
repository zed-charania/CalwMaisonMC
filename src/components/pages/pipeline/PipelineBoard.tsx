'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { usePipeline } from '@/lib/hooks/usePipeline';
import { useAgents } from '@/lib/hooks/useAgents';
import type { PipelineStage, PipelineItem } from '@/lib/types';
import PipelineColumn from './PipelineColumn';

const STAGES: PipelineStage[] = ['ideas', 'scripting', 'thumbnail', 'filming', 'editing'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

function groupByStage(items: PipelineItem[]): Record<PipelineStage, PipelineItem[]> {
  const grouped: Record<PipelineStage, PipelineItem[]> = {
    ideas: [],
    scripting: [],
    thumbnail: [],
    filming: [],
    editing: [],
  };

  for (const pipelineItem of items) {
    if (grouped[pipelineItem.stage]) {
      grouped[pipelineItem.stage].push(pipelineItem);
    }
  }

  // Sort each column by position
  for (const stage of STAGES) {
    grouped[stage].sort((a, b) => a.position - b.position);
  }

  return grouped;
}

function LoadingSkeleton() {
  return (
    <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {STAGES.map((stage) => (
        <div key={stage} className="flex-1 min-w-0">
          <div className="card rounded-xl p-4" style={{ minHeight: 400 }}>
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="shimmer rounded-lg"
                style={{ width: 80, height: 20, background: 'var(--neutral-subtle)' }}
              />
              <div
                className="shimmer rounded-full"
                style={{ width: 24, height: 24, background: 'var(--neutral-subtle)' }}
              />
            </div>
            {/* Card skeletons */}
            {[1, 2, 3].slice(0, stage === 'ideas' ? 3 : stage === 'scripting' ? 2 : 1).map((n) => (
              <div
                key={n}
                className="shimmer rounded-xl mb-3"
                style={{ height: 88, background: 'var(--neutral-subtle)' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PipelineBoard() {
  const { items, isLoading, mutate } = usePipeline();
  const { agents } = useAgents();

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { draggableId, destination, source } = result;

      // Dropped outside a droppable area
      if (!destination) return;

      // Dropped in the same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const newStage = destination.droppableId as PipelineStage;
      const newPosition = destination.index;

      // Optimistic update
      if (items) {
        const updatedItems = [...items];
        const draggedIndex = updatedItems.findIndex((i) => i.id === draggableId);
        if (draggedIndex !== -1) {
          const [draggedItem] = updatedItems.splice(draggedIndex, 1);
          draggedItem.stage = newStage;
          draggedItem.position = newPosition;

          // Recompute positions for the destination column
          const columnItems = updatedItems
            .filter((i) => i.stage === newStage)
            .sort((a, b) => a.position - b.position);
          columnItems.splice(newPosition, 0, draggedItem);
          columnItems.forEach((ci, idx) => {
            ci.position = idx;
          });

          mutate(updatedItems, false);
        }
      }

      try {
        await fetch('/api/pipeline/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: draggableId,
            newStage,
            newPosition,
          }),
        });
        mutate();
      } catch {
        // Revert on error
        mutate();
      }
    },
    [items, mutate]
  );

  const grouped = items ? groupByStage(items) : null;
  const agentList = agents ?? [];

  return (
    <div>
      {/* Page Header */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="mb-6"
      >
        <h1 className="text-title">Content Pipeline</h1>
        <p className="text-caption mt-1">
          Track content from idea to final edit. Drag cards between stages to update progress.
        </p>
      </motion.div>

      {/* Board */}
      {isLoading || !grouped ? (
        <LoadingSkeleton />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex gap-4"
            style={{ minHeight: 'calc(100vh - 180px)' }}
          >
            {STAGES.map((stage) => (
              <motion.div key={stage} variants={item} className="flex-1 min-w-0">
                <PipelineColumn
                  stage={stage}
                  items={grouped[stage]}
                  agents={agentList}
                />
              </motion.div>
            ))}
          </motion.div>
        </DragDropContext>
      )}
    </div>
  );
}
