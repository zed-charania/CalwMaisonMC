/**
 * Maps snake_case DB rows to camelCase client types.
 * Used by all API routes to bridge the DB layer and frontend types.
 */

import type { PipelineItem as DbPipelineItem } from '@/lib/db/pipeline';
import type { ScheduledJob as DbScheduledJob } from '@/lib/db/schedule';
import type {
  JournalEntry as DbJournalEntry,
  JournalEntryWithCount as DbJournalEntryWithCount,
  JournalEntryWithSubEntries as DbJournalEntryWithSubEntries,
  JournalSubEntry as DbJournalSubEntry,
} from '@/lib/db/journal';
import type { Agent as DbAgent } from '@/lib/db/agents';
import type { ActivityEvent as DbActivityEvent } from '@/lib/db/activity';
import type { OngoingTask as DbOngoingTask } from '@/lib/db/ongoing';
import type { Workflow as DbWorkflow } from '@/lib/db/workflows';

export function mapPipelineItem(row: DbPipelineItem) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    stage: row.stage,
    platform: row.platform,
    ownerAgentId: row.owner_agent_id ?? undefined,
    position: row.position,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapScheduledJob(row: DbScheduledJob) {
  return {
    id: row.id,
    title: row.title,
    cronExpression: row.cron_expression ?? undefined,
    isAlwaysRunning: row.is_always_running === 1,
    color: row.color,
    nextRunAt: row.next_run_at ?? undefined,
    status: row.status,
    agentId: row.agent_id ?? undefined,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapJournalSubEntry(row: DbJournalSubEntry) {
  return {
    id: row.id,
    journalEntryId: row.journal_entry_id,
    content: row.content,
    entryType: row.entry_type,
    createdAt: row.created_at,
  };
}

export function mapJournalEntry(row: DbJournalEntry) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    tags: row.tags,
    agentId: row.agent_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapJournalEntryWithCount(row: DbJournalEntryWithCount) {
  return {
    ...mapJournalEntry(row),
    subEntryCount: row.sub_entry_count,
  };
}

export function mapJournalEntryWithSubEntries(row: DbJournalEntryWithSubEntries) {
  return {
    ...mapJournalEntry(row),
    subEntries: row.sub_entries.map(mapJournalSubEntry),
  };
}

export function mapAgent(row: DbAgent) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    avatarColor: row.avatar_color,
    status: row.status,
    traits: row.traits,
    inputSignals: row.input_signals,
    outputActions: row.output_actions,
    parentAgentId: row.parent_agent_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapActivityEvent(row: DbActivityEvent) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    agentId: row.agent_id ?? undefined,
    timestamp: row.created_at,
  };
}

export function mapOngoingTask(row: DbOngoingTask) {
  return {
    id: row.id,
    title: row.title,
    state: row.state,
    currentStep: row.current_step,
    progress: row.progress,
    agentId: row.agent_id ?? undefined,
    blockers: row.blockers,
    startedAt: row.started_at,
    estimatedCompletion: row.estimated_completion ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapWorkflow(row: DbWorkflow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    trigger: row.trigger_type,
    steps: row.steps,
    active: row.active === 1,
    totalRuns: row.total_runs,
    successRate: row.success_rate,
    lastRun: row.last_run ?? undefined,
    nextRun: row.next_run ?? undefined,
  };
}
